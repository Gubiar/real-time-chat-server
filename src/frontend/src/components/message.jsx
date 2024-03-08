import PropTypes from "prop-types";
import AvatarUser from "./avatarUser";

Message.propTypes = {
    message: PropTypes.object.isRequired,
    isAdm: PropTypes.bool.isRequired,
};

export default function Message({ message, isAdm }) {
    return (
        <div className={`flex items-center gap-4 ${isAdm ? "justify-end" : "flex-row-reverse justify-end"}`}>
            <div className="rounded-lg border max-w-[70%]">
                <p className="p-4 text-sm/relaxed">{message.content}</p>
            </div>
            <AvatarUser nome={message.sender} />
        </div>
    );
}
