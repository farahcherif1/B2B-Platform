import apiClientAuth from "./API/authenticated";
export default class MeetingService {
    static async getMeetings(filter) {
        try {
        const response = await apiClientAuth.get("/meeting",
        {
            params: {
            ...filter,
            },
        }
        );
        return response;
        } catch (error) {
        console.error(error);
        return null;
        }
    }
    
    static async getMeetingDetails(id) {
        try {
        const response = await apiClientAuth.get(`/meeting/${id}`);
        return response;
        } catch (error) {
        console.error(error);
        return null;
        }
    }
    
    static async createMeeting(data) {
        try {
        const response = await apiClientAuth.post(`/meeting`, data);
        return response;
        } catch (error) {
        return (error);
        }
    }
    static async getLocations(eventId) {
        try {
            const response = await apiClientAuth.get(`/location/${eventId}`);
            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    static async getSessions(eventId) {
        try {
            const response = await apiClientAuth.get(`/session/${eventId}`);
            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    static async updateMeeting(data) {
        try {
            const response = await apiClientAuth.put(`/meeting/${data.id}`, data);
            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}