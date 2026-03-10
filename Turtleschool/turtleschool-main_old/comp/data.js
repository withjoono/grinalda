import axios from 'axios';

const getData = (api_url, setData, params, memberId) => {
  const get_ = async () => {
    const response = await axios.get(api_url, {
      headers: {
        'Content-Type': 'application/json',
        auth: memberId,
      },
      params: params,
    });
    return response.data.data;
  };

  const set_ = async () => {
    const result = await get_();
    setData(result);
  };

  return set_();
};

const postData = (api_url, setData, params, memberId) => {
  const get_ = async () => {
    const response = await axios.post(api_url, params, {
      headers: {
        'Content-Type': 'application/json',
        auth: memberId,
      },
    });

    return response.data.data;
  };

  const set_ = async () => {
    const result = await get_();
    if (setData) setData(result);
  };

  return set_();
};

export {getData, postData};
