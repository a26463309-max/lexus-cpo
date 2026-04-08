import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import ContactUs from "./pages/ContactUs";
import Appraisal from "./pages/Appraisal";
import Locations from "./pages/Locations";
import VehicleDetail from "./pages/VehicleDetail";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/compare"} component={Compare} />
      <Route path={"/contact"} component={ContactUs} />
      <Route path={"/appraisal"} component={Appraisal} />
      <Route path={"/locations"} component={Locations} />
      <Route path={"/about"} component={About} />
      <Route path={"/vehicle/:id"} component={VehicleDetail} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
