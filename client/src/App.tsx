/** Signal Office style: the app shell is editorial, asymmetric, precise, and action-led. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import SiteLayout from "./components/SiteLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import Contact from "./pages/Contact";
import Diagnostic from "./pages/Diagnostic";
import A11Workspace from "./pages/A11Workspace";
import A11EvidenceLibrary from "./pages/A11EvidenceLibrary";
import A11IncidentRoom from "./pages/A11IncidentRoom";
import A11ProductBrief from "./pages/A11ProductBrief";
import A11ResearchCenter from "./pages/A11ResearchCenter";
import A11EvidenceMap from "./pages/A11EvidenceMap";
import A11ProductTimeline from "./pages/A11ProductTimeline";
import A11ProvenanceIntake from "./pages/A11ProvenanceIntake";
import Home from "./pages/Home";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";
import Process from "./pages/Process";
import QualificationDesk from "./pages/QualificationDesk";
import Services from "./pages/Services";
import { Route, Switch, useLocation } from "wouter";
function Router() {
  const [location] = useLocation();
  if (location === "/desk") return <QualificationDesk />;
  if (location === "/a11") return <A11Workspace />;
  if (location === "/a11/evidence") return <A11EvidenceLibrary />;
  if (location === "/a11/incidents") return <A11IncidentRoom />;
  if (location === "/a11/product") return <A11ProductBrief />;
  if (location === "/a11/research") return <A11ResearchCenter />;
  if (location === "/a11/evidence-map") return <A11EvidenceMap />;
  if (location === "/a11/product-timeline") return <A11ProductTimeline />;
  if (location === "/a11/intake") return <A11ProvenanceIntake />;
  return (
    <SiteLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/process" component={Process} />
        <Route path="/insights" component={Insights} />
        <Route path="/contact" component={Contact} />
        <Route path="/diagnostic" component={Diagnostic} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </SiteLayout>
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
