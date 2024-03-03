import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Toastr = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            style={{fontSize: "14.5px"}}
        />
    )
};

export default Toastr;