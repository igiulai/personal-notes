import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { fetchUser } from "../../api/User";
import { queryClient } from "../../api/queryClient";
import { Loader } from "../Loader";
import { UserView } from ".";

interface FetchUserViewProps {
    userId: string;
}

export const FetchUserView: FC<FetchUserViewProps> = ({ userId }) => {
    const userQuery = useQuery(
        {
            queryFn: () => fetchUser(userId),
            queryKey: ["users", userId],
        },
        queryClient
    );

    switch (userQuery.status) {
        case "pending":
            return <Loader />;

            case "success":
                return <UserView user={userQuery.data} />;

case "error":
    return (
    <div>
        <span>Error</span>
        <button onClick={() => userQuery.refetch()}>
            Try again
            </button>
    </div>
    );
    }
};