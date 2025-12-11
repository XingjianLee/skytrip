import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCancelPreview, cancelOrder } from "@/lib/api";

const CancelOrder = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const orderId: number | undefined = state?.orderId;
  const [flightDate, setFlightDate] = useState<string>("");
  const [preview, setPreview] = useState<{ penalty_total: number; refund_total: number; items: { item_id: number; paid_price: number; penalty: number; refund: number; }[] } | null>(null);

  const token = localStorage.getItem("access_token") || "";

  const handlePreview = async () => {
    if (!orderId || !flightDate) {
      toast({ title: "请选择航班日期" });
      return;
    }
    try {
      const res = await getCancelPreview(orderId, flightDate, token);
      setPreview(res);
    } catch (e: any) {
      toast({ title: "预览失败", description: e?.message, variant: "destructive" });
    }
  };

  const handleConfirm = async () => {
    if (!orderId || !flightDate) return;
    try {
      await cancelOrder(orderId, flightDate, token);
      toast({ title: "订单已取消" });
      navigate("/my-orders");
    } catch (e: any) {
      toast({ title: "取消失败", description: e?.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={true} />
      <section className="py-8 flex-1">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">取消订单</h1>
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div>
                <label htmlFor="flightDate" className="text-sm font-medium">航班日期 *</label>
                <Input id="flightDate" type="date" value={flightDate} onChange={e => setFlightDate(e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">日期需在未来21天运营掩码允许的日期</p>
              </div>

              <div className="flex gap-3">
                <Button onClick={handlePreview}>费用预览</Button>
                <Button variant="outline" onClick={() => navigate(-1)}>返回</Button>
              </div>

              {preview && (
                <div className="mt-4">
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">手续费合计</span><span>¥{preview.penalty_total.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">预计退款合计</span><span>¥{preview.refund_total.toFixed(2)}</span></div>
                  </div>
                  <Separator className="my-4" />
                  <div className="text-sm text-muted-foreground">按乘客明细</div>
                  <div className="space-y-2 mt-2">
                    {preview.items.map(it => (
                      <div key={it.item_id} className="flex justify-between text-sm">
                        <span>明细 #{it.item_id}</span>
                        <span>支付 ¥{it.paid_price.toFixed(2)} / 手续费 ¥{it.penalty.toFixed(2)} / 退款 ¥{it.refund.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button className="flex-1" onClick={handleConfirm}>确认取消</Button>
                    <Button variant="outline" className="flex-1" onClick={() => navigate("/my-orders")}>稍后再说</Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CancelOrder;
