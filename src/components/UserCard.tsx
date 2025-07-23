import React from "react";
import Image from "next/image";

interface UserCardProps {
    user: {
        id: number;
        username: string;
        image: string;
    };
    onClick: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => (
    <div
        className="p-6 bg-dark-secondary rounded-lg shadow-md hover:shadow-lg transition cursor-pointer text-center"
        onClick={() => onClick(user.id)}
    >
        <Image
            src={user.image}
            alt={user.username}
            width={96}
            height={96}
            className="aspect-square rounded-full mx-auto mb-4 shadow-md object-cover"
        />
        <h3 className="text-xl font-bold text-dark-accent">{user.username}</h3>
    </div>
);

export default UserCard;