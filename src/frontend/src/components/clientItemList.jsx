import PropTypes from "prop-types";
import AvatarUser from "./avatarUser";

ClientItemList.propTypes = {
    nome: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
};

export default function ClientItemList({ nome, id }) {
    return (
        <div className="flex items-center p-4 space-x-3">
            <AvatarUser nome={nome} />
            <div className="space-y-1 flex flex-col items-start">
                <h4 className="text-sm font-bold">{String(nome).toUpperCase()}</h4>
                <p className="text-xs text-slate-600">
                    id: <strong>{id}</strong>
                </p>
            </div>
        </div>
    );
}
