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
    phone_number: string,
    dob: string,
    profile_picture: string,
    language: string,
    is_store_owner: boolean,
    is_staff: boolean,
    is_active: boolean,
    date_joined: string,
    setting: UserSettings | null,
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

export type LoginRequestResponse = {
    access: string,
    refresh: string,
    access_expiration: string,
    refresh_expiration: string,
    user: AuthUser
};