import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export enum ViewStatus {
  Idle = 0,
  Loading = 1,
  Error = 2,
  Success = 3,
}

export type EndPoint = {
  name: string;
  url: string;
};

export type PfbTx = {
  namespaceId: string;
  data: string;
};

interface EndpointsState {
  viewStatus: ViewStatus;
  errorMessage: string;
  result: any;
  endpoints: EndPoint[];
  add: (endpoint: EndPoint) => void;
  remove: (endpointUrl: string) => void;
  submit: (tx: PfbTx, url: string) => void;
  reset: () => void;
}

export const useEndpointsStore = create<EndpointsState>()(
  persist(
    (set, get) => ({
      viewStatus: ViewStatus.Idle,
      errorMessage: "",
      result: undefined,
      endpoints: [],
      add: (endpoint) => {
        const list = [...get().endpoints];
        list.push(endpoint);
        set((state) => ({ ...state, endpoints: list }));
      },
      remove: (endpointUrl) => {
        const list = get().endpoints.filter((e) => e.url !== endpointUrl);
        set((state) => ({ ...state, endpoints: list }));
      },
      submit: async (tx, url) => {
        set((state) => ({ ...state, viewStatus: ViewStatus.Loading, result: undefined }));
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              namespace_id: tx.namespaceId,
              data: tx.data,
              gas_limit: 80000,
              fee: 2000,
            }),
          });

          const res = await response.json();
          console.log("@@@@ RES", res);

          if (response.status !== 200) {
            return set((state) => ({ ...state, viewStatus: ViewStatus.Error, errorMessage: JSON.stringify(res) }));
          }

          set((state) => ({ ...state, viewStatus: ViewStatus.Success, result: res }));
        } catch (error) {
          set((state) => ({ ...state, viewStatus: ViewStatus.Error, errorMessage: JSON.stringify(error) }));
        }
      },
      reset: () => set((state) => ({ ...state, viewStatus: ViewStatus.Idle, result: undefined, errorMessage: "" })),
    }),
    {
      name: "endpoints-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
