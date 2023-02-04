import { useState, useEffect, useCallback } from 'react';

import API from './API.js';

export default function useLoad(endpoint) {

  // State ---------------------------------------
  const [records, setRecords] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('Loading records ...');

  // Methods -------------------------------------
  const loadRecords = useCallback(async () => {
    const response = await API.get(endpoint);
    response.isSuccess
      ? setRecords(response.result)
      : setLoadingMessage(response.message)
  },[endpoint]);

  useEffect(() => { loadRecords() }, [loadRecords]);

  // Return --------------------------------------
  return [records, setRecords, loadingMessage, loadRecords];
}
