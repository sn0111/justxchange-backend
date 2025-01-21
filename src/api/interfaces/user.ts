export interface IVerifyOtp {
    mobileNumber: string;
    otp: string;
    lastLoginOtp: string;
}

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    mobileNumber: string;
    college: string;
}

export interface IUserLoginIn {
    password: string;
    mobileNumber: string;
}

export interface IUserProfile {
    id: string;
    firstName: string;
    email: string;
    mobileNumber: string;
    college: string;
    address: string;
    contactNumber: string;
    is2FAEnabled: boolean;
    profileUrl: string;
    isContactView: boolean;
}
