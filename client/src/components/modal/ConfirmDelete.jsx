import React from 'react'
import Button from '../Button';

const ConfirmDelete = ({
    title = 'Confirmation Required',
    message = 'Are you sure you want to perform this action?',
    onConfirm,
    btnStyle = 'text-white hover:bg-red-600 bg-red-500',
    showModel,
    onClose,
    loading,
}) => {


    return (
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle" open={showModel}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action">
                    <form method="dialog">
                        <div className="modal-action">
                            <button onClick={onClose} className="btn tracking-wider">Cancel</button>
                            <Button className='!w-[100px] !m-0 !bg-red-500 !hover:bg-red-600 !text-white !border-none' loading={loading} title='Delete' type='button' onClick={onConfirm} />
                            {/* <button onClick={onConfirm} className={`btn tracking-wider border-none ${btnStyle}`}>Delete</button> */}
                        </div>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

export default ConfirmDelete
