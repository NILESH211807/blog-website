import Button from '../Button';

const Confirm = ({
    title = 'Confirmation Required',
    message = 'Are you sure you want to perform this action?',
    onConfirm,
    className = 'text-white hover:bg-primary-focus bg-primary',
    showModel,
    onCancel,
    loading
}) => {
    return (
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle" open={showModel}>
            <div className="modal-box min-xl:ml-64">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action">
                    <form method="dialog">
                        <div className="modal-action">
                            <button type='button' onClick={onCancel} className="btn tracking-wider">Cancel</button>
                            <Button type='button' loading={loading} title='Confirm' className={`!w-[100px] !m-0 !border-none ${className}`} onClick={onConfirm} />
                        </div>
                    </form>
                </div>
            </div>
        </dialog>

    )
}

export default Confirm
