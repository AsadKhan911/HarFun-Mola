import Constants from 'expo-constants';

const localIP = Constants.expoConfig?.hostUri?.split(':')[0]; // Extracts the current local IP

export const BASE_URL = `http://${localIP}:3000/api/v1`;

export const userBaseUrl = `${BASE_URL}/user`;
export const CategoryBaseUrl = `${BASE_URL}/majorcategory`;
export const MajorListingsBaseUrl = `${BASE_URL}/majorlistings`;
export const BookingBaseUrl = `${BASE_URL}/booklistings`;
export const PaymentBaseUrl = `${BASE_URL}/bookingpayment`;
export const MinorCategoryBaseUrl = `${BASE_URL}/minorcategory`;
export const MinorServicesBaseUrl = `${BASE_URL}/minorservice`;
export const MinorListingsBaseUrl = `${BASE_URL}/minorlisting`;
export const BiddingModelBaseUrl = `${BASE_URL}/biddingAndDealMaking`;
export const AssistiveFixBaseUrl = `${BASE_URL}/assistiveFix`;
export const IntelliServeBaseUrl = `${BASE_URL}/intelliServe`;
