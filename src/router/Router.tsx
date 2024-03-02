import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import { HelmetProvider } from "react-helmet-async";
import Pagetitle from "../components/Pagetitle/Pagetitle";


const RouterCommunity = () => {
	return (
		<HelmetProvider>
			<Router>
				<Routes>
					<Route path="/" element={<><Pagetitle title={"Login"} /><Login /></>} />
					<Route path="/dashboard" element={<><Pagetitle title={"Dashboard"} /><Dashboard /></>} />
				</Routes>
			</Router>
		</HelmetProvider>
	);
};


export default RouterCommunity;