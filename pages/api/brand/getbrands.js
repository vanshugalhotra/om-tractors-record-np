import Brand from "@/models/Brand";
import connectDb from "@/db/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { search } = req.query;
      // Create a search query for brandS using a regular expression
      const brandSearchQuery = search
        ? {
            $or: [{ name: { $regex: search, $options: "i" } }],
          }
        : {};

      const brandS = await Brand.find(brandSearchQuery);

      res.status(200).json(brandS);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default connectDb(handler);
