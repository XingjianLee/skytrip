import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import BookFlight from "./pages/BookFlight";
import BookHotel from "./pages/BookHotel";
import HotelDetail from "./pages/HotelDetail";
import BookTicket from "./pages/BookTicket";
import TicketDetail from "./pages/TicketDetail";
import MyTrips from "./pages/MyTrips";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import CheckIn from "./pages/CheckIn";
import PriceCalendar from "./pages/PriceCalendar";
import TravelAssistant from "./pages/TravelAssistant";
import RefundChange from "./pages/RefundChange";
import CustomerService from "./pages/CustomerService";
import OrderFlight from "./pages/OrderFlight";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/wing-quest-suite">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hero" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book-flight" element={<BookFlight />} />
          <Route path="/book-hotel" element={<BookHotel />} />
          <Route path="/hotel/:id" element={<HotelDetail />} />
          <Route path="/book-ticket" element={<BookTicket />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/price-calendar" element={<PriceCalendar />} />
          <Route path="/travel-assistant" element={<TravelAssistant />} />
          <Route path="/refund-change" element={<RefundChange />} />
          <Route path="/customer-service" element={<CustomerService />} />
          <Route path="/order-flight" element={<OrderFlight />} />
          <Route path="/payment" element={<Payment />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
