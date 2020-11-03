import React, { useState, useCallback, useEffect } from 'react';

function EnvironmentSelector(props) {
  const [selectEnv, setSelectEnv] = useState('');

  return (
    <form className="env-select">
      <select name="environment">{dropdownEnv}</select>
    </form>
  );
}

export default EnvironmentSelector;
