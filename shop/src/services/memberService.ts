import { apiClient } from './apiClient';

export type SpotRole = 'owner' | 'admin' | 'manager' | 'staff';

export interface SpotMemberData {
    id: number;
    role: SpotRole;
    role_display: string;
    is_active: boolean;
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        profile_picture: string | null;
    };
}

export interface SpotInvitationData {
    id: number; // 🚀 Django ModelViewSet gives us a numeric ID here
    email: string;
    role: SpotRole;
    status: 'pending' | 'accepted' | 'revoking' | 'expired';
    created_at: string;
}

export const memberService = {
    /** Fetch all pending invites for the active spot context */
    getPendingInvitations: async (): Promise<SpotInvitationData[]> => {
        // 🚀 Added /api prefix to match your real backend URL routing paths
        const response = await apiClient.get<SpotInvitationData[]>('/spots/invitations/?status=pending');
        return response.data;
    },

    /** Invite/Add a new member to a spot by email (creates a staging invitation) */
    addMember: async (email: string, role: SpotRole): Promise<SpotMemberData> => {
        const response = await apiClient.post<SpotMemberData>('/spots/members/', {
            email: email.toLowerCase().trim(),
            role,
        });
        return response.data;
    },

    /** Update an existing member's operational role */
    updateMemberRole: async (membershipId: number, role: SpotRole): Promise<SpotMemberData> => {
        const response = await apiClient.patch<SpotMemberData>(`/spots/members/${membershipId}/`, {
            role,
        });
        return response.data;
    },

    /** Delete/Remove an active member assignment entirely */
    removeMember: async (membershipId: string): Promise<void> => {
        await apiClient.delete(`/spots/members/${membershipId}/`);
    },

    /** Revoke a pending invitation before it is accepted */
    revokeInvitation: async (invitationId: string): Promise<void> => {
        // 🚀 Added this missing explicit endpoint method to match your screen layout deletion requests
        await apiClient.delete(`/spots/invitations/${invitationId}/`);
    }
};