import { getRequest, postRequest } from 'utils/request';

export const getDataListService = params => getRequest('/common/getopencitylist', params);

export const postFormDataService = params => postRequest('/common/testpost', params);

export default {};
