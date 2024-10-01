import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { ModalAdd } from './ModalAdd.js';
import { ModalDelete } from './ModalDelete.js';
import { ModalRename } from './ModalRename.js';

export const Modal = () => {
  const modalType = useSelector((state) => state.modal.modalType);
  return (
    <>
      <div className="fade modal-backdrop show" />
      {modalType === 'add' ? <ModalAdd /> : null}
      {modalType === 'delete' ? <ModalDelete /> : null}
      {modalType === 'rename' ? <ModalRename /> : null}
    </>
  );
};
