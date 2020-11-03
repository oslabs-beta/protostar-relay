/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { DevToolsHook, RelayEnvironment, EnvironmentWrapper } from './types';
import type Agent from './agent';

import { attach } from './EnvironmentWrapper';

export function initBackend(hook: DevToolsHook, agent: Agent, global: Object): () => void {
  const subs = [
    hook.sub('environment.event', data => {
      agent.onEnvironmentEvent(data);
    }),
    hook.sub('environment.store', data => {
      agent.onStoreData(data);
    }),
    hook.sub(
      'environment-attached',
      ({
        id,
        environment,
        environmentWrapper
      }: {
        id: number,
        environment: RelayEnvironment,
        environmentWrapper: EnvironmentWrapper
      }) => {
        agent.setEnvironmentWrapper(id, environmentWrapper);
        agent.onEnvironmentInitialized({
          id: id,
          environmentName: environment.configName
        });
        // Now that the Store and the renderer interface are connected,
        // it's time to flush the pending operation codes to the frontend.
        environmentWrapper.flushInitialOperations();
      }
    )
  ];

  const attachEnvironment = (id: number, environment: RelayEnvironment) => {
    let environmentWrapper = hook.environmentWrappers.get(id);

    // Inject any not-yet-injected renderers (if we didn't reload-and-profile)
    if (!environmentWrapper) {
      environmentWrapper = attach(hook, id, environment, global);
      hook.environmentWrappers.set(id, environmentWrapper);
    }

    // Notify the DevTools frontend about new renderers.
    hook.emit('environment-attached', {
      id,
      environment,
      environmentWrapper
    });
  };

  // Connect renderers that have already injected themselves.
  hook.environments.forEach((environment, id) => {
    attachEnvironment(id, environment);
  });

  // Connect any new renderers that injected themselves.
  subs.push(
    hook.sub(
      'environment',
      ({ id, environment }: { id: number, environment: RelayEnvironment }) => {
        attachEnvironment(id, environment);
      }
    )
  );

  return () => {
    subs.forEach(fn => fn());
  };
}
