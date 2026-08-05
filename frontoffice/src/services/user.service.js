import apiClientAuth from "./API/authenticated";
export default class UserService {
    static async getUsersRegistred(idEvent,searchQuery) {
        const url = `/user/${idEvent}${searchQuery ? `/${searchQuery}` : ''}`;

        try {
            const response = await apiClientAuth.get(url, {
               
            });

            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

}