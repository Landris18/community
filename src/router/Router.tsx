import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import { HelmetProvider } from "react-helmet-async";
import Pagetitle from "../components/Pagetitle/Pagetitle";
import PrivateRoute from "../guards/PrivateRoute";


const RouterCommunity = () => {
	return (
		<HelmetProvider>
			<Router>
				<Routes>
					<Route
						path="/"
						element={
							<PrivateRoute page="login" redirectTo="/dashboard">
								<Pagetitle title={"Login"} /><Login />
							</PrivateRoute>
						}
					/>
					<Route
						path="/dashboard"
						element={
							<PrivateRoute page="dashboard" redirectTo="/">
								<Pagetitle title={"Dashboard"} /><Dashboard />
							</PrivateRoute>
						}
					/>
				</Routes>
			</Router>
		</HelmetProvider>
	);
};


export default RouterCommunity;