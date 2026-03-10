import { useGetProducts } from "@/stores/server/features/products/queries";
import { createFileRoute } from "@tanstack/react-router";
import { mapProductsToPlans } from "../../constants/product.mapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingCard } from "@/components/pricing-card";
import { useGetActiveServices } from "@/stores/server/features/me/queries";

export const Route = createFileRoute("/products/")({
  component: Products,
});

function Products() {
  const products = useGetProducts();
  const activeServices = useGetActiveServices();

  const { susiServices, susiServicePackage, susiTickets, plansConsulting } =
    mapProductsToPlans(products.data || []);

  const plansSusi = [...susiServices, ...susiServicePackage, ...susiTickets];

  if (products.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full py-20">
      <div className="flex justify-center">
        <section className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            청사에이아이 이용권 구매
          </h2>
          <p className="pt-1 text-lg sm:text-xl">
            현재 6개 대학 수시 합불 증명시 수시 이용료 전액 환불 이벤트
            진행중입니다.
          </p>
          <p className="pt-1 text-sm">(단, 생기부 평가 비용은 제외됩니다)</p>
          <br />
        </section>
      </div>
      <Tabs defaultValue="susi/jungsi" className="px-2">
        <TabsList className="mx-auto grid w-full max-w-72 grid-cols-3">
          <TabsTrigger value="susi/jungsi">수시/정시</TabsTrigger>
          <TabsTrigger value="mentoring">멘토링</TabsTrigger>
          <TabsTrigger value="consulting">컨설팅</TabsTrigger>
        </TabsList>
        <TabsContent value="susi/jungsi">
          <section>
            <div className="mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
              {plansSusi.map((plan) => {
                return (
                  <PricingCard
                    key={plan.title}
                    {...plan}
                    isActive={
                      (plan.serviceRange &&
                        (activeServices.data || []).includes(
                          plan.serviceRange,
                        )) ||
                      false
                    }
                  />
                );
              })}
            </div>
            {/* <img
              src={"/images/product_susi.png"}
              alt="store-susi-img"
              className="mx-auto"
            /> */}
          </section>
        </TabsContent>
        {/* <TabsContent value="jungsi">
          <section className="mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
            <div className="flex flex-col items-center justify-center gap-2 py-20">
              <p className="text-lg font-semibold">🥺 서비스 준비중입니다.</p>
              <p className="text-sm">빠른 시일내에 찾아뵙도록 하겠습니다!</p>
            </div>
          </section>
        </TabsContent> */}
        <TabsContent value="mentoring">
          <section className="mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
            <div className="flex flex-col items-center justify-center gap-2 py-20">
              <p className="text-lg font-semibold">🥺 서비스 준비중입니다.</p>
              <p className="text-sm">빠른 시일내에 찾아뵙도록 하겠습니다!</p>
            </div>
          </section>
        </TabsContent>
        <TabsContent value="consulting">
          <section className="mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
            {plansConsulting.map((plan) => {
              return (
                <PricingCard
                  key={plan.title}
                  {...plan}
                  isActive={
                    (plan.serviceRange &&
                      (activeServices.data || []).includes(
                        plan.serviceRange,
                      )) ||
                    false
                  }
                />
              );
            })}
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
