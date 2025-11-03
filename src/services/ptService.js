import axiosClient from "~/api/axiosClient";

export const ptService = {
  getAllPTs: async () => {
    const res = await axiosClient.get("/admin/pts");
    return res.data;
  },
};
