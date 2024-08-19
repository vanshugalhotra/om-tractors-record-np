import Type from "@/models/Type";
import connectDb from "@/db/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { search } = req.query;
      // Create a search query for typeS using a regular expression
      const typeSearchQuery = search
        ? {
            $or: [{ name: { $regex: search, $options: "i" } }],
          }
        : {};

      const typeS = await Type.find(typeSearchQuery);

      res.status(200).json(typeS);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default connectDb(handler);
