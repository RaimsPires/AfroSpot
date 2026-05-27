export type AuthPayload = {
    login_id: string;
    password: string;
};

export type PasswordResetRequestPayload = {
    email: string;
};

export type PasswordResetConfirmPayload = {
    uid: string;
    token: string;
    new_password1: string;
    new_password2: string;
};

export type PasswordChangePayload = {
    old_password: string;
    new_password1: string;
    new_password2: string;
};

export type AuthUser = {
    id: string,
    email: string,
    first_name: string,
    last_name: string,
    full_name: string,
    active_address: string | null,
    phone_number: string,
    dob: string,
    profile_picture: string,
    language: string,
    is_store_owner: boolean,
    is_staff: boolean,
    is_active: boolean,
    date_joined: string,
    created_at: string,
    updated_at: string,
    settings: UserSettings | null,
    addresses: UserAddress[]
};


export type UserSettings = {
    id: string,
    created_at: string,
    updated_at: string,
    is_deleted: boolean,
    deleted_at: string | null,
    country_of_residence: string,
    country_of_origin: string,
    theme: string,
    email_notifications: boolean,
    email_verifications: boolean,
    push_notifications: boolean,
    marketing_emails: boolean,
    user: string
};

export type UserAddress = {
    id: string
    address_type: 'home' | 'work' | 'other'
    is_active: boolean
    user: string
    address: string
    city: string
    state: string
    zip_code: string
    country: string
}

export type CreateUserAddressPayload = {
    address_type: 'home' | 'work' | 'other'
    is_active?: boolean
    address: string
    city: string
    state: string
    zip_code: string
    country: string
};

export type UpdateUserAddressPayload = Partial<CreateUserAddressPayload>;

export type UploadableImage = {
    uri: string;
    name: string;
    type: string;
};

export type UpdateUserSettingsPayload = {
    is_deleted?: boolean;
    deleted_at?: string | null;
    country?: string;
    country_of_origin?: string;
    theme?: string;
    email_notifications?: boolean;
    email_verifications?: boolean;
    push_notifications?: boolean;
    marketing_emails?: boolean;
};

export type UpdateUserProfilePayload = {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    dob?: string;
    profile_picture?: string | UploadableImage | null;
    language?: string;
    is_store_owner?: boolean;
    settings?: UpdateUserSettingsPayload;
};

export type LoginRequestResponse = {
    access: string,
    refresh: string,
    access_expiration: string,
    refresh_expiration: string,
    user: AuthUser
};

export type RegisterPayload = {
    email: string;
    password1: string;
    password2: string;
    first_name: string;
    last_name: string;
    dob?: string;
    country?: string;
    phone_number?: string;
    profile_picture?: UploadableImage | null;
    language?: string;
};

export type RegistrationResponse = {
    detail: string;
};

export type EmailCheckResponse = {
    available: boolean;
};