import PropTypes from "prop-types";

AvatarUser.propTypes = {
    nome: PropTypes.string.isRequired,
};

export default function AvatarUser({ nome }) {
    return (
        <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8 bg-blue-500">
            <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-white text-xs">
                {String(nome).slice(0, 2).toUpperCase()}
            </span>
        </span>
    );
}
