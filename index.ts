import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { Destination, DestinationDocument, PaginatedDestinations } from "./types/destination";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());


const uri = process.env.MONGO_DB_URI;
if (!uri) { throw new Error("Mongodb variable is not set") };
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db("Auralis");
        const destinationsCollection = database.collection<DestinationDocument>("destinations");

        function toDestinationDTO(doc: DestinationDocument): Destination {
            return { ...doc, _id: doc._id.toHexString() };
        }

        // ---- GET /api/destinations ----
        app.get("/api/destinations", async (req, res) => {
            try {
                const {
                    search,
                    continent,
                    categories,
                    budgetLevel,
                    minRating,
                    minDuration,
                    maxDuration,
                    activityLevel,
                    bestFor,
                    sortBy = "popular",
                    page = "1",
                    limit = "9",
                } = req.query as Record<string, string>;

                const filter: Record<string, any> = {};

                if (search) {
                    filter.title = { $regex: search, $options: "i" };
                }
                if (continent) {
                    filter.continent = continent;
                }
                if (categories) {
                    filter.categories = { $in: categories.split(",").map((c) => c.trim()) };
                }
                if (budgetLevel) {
                    filter.budgetLevel = { $in: budgetLevel.split(",").map((b) => b.trim()) };
                }
                if (minRating) {
                    filter.rating = { $gte: Number(minRating) };
                }
                if (minDuration || maxDuration) {
                    filter.durationDays = {};
                    if (minDuration) filter.durationDays.$gte = Number(minDuration);
                    if (maxDuration) filter.durationDays.$lte = Number(maxDuration);
                }
                if (activityLevel) {
                    filter.activityLevel = { $in: activityLevel.split(",").map((a) => a.trim()) };
                }
                if (bestFor) {
                    filter.bestFor = { $in: bestFor.split(",").map((b) => b.trim()) };
                }

                const sortMap: Record<string, Record<string, 1 | -1>> = {
                    popular: { reviewCount: -1 },
                    rating: { rating: -1 },
                    name: { title: 1 },
                    cost_asc: { avgBudgetPerDay: 1 },
                    cost_desc: { avgBudgetPerDay: -1 },
                };
                const sortStage = sortMap[sortBy] ?? sortMap.popular;

                const pageNum = Math.max(1, parseInt(page));
                const limitNum = Math.max(1, parseInt(limit));
                const skip = (pageNum - 1) * limitNum;

                const collection = destinationsCollection;

                const [docs, total] = await Promise.all([
                    collection.find(filter).sort(sortStage).skip(skip).limit(limitNum).toArray(),
                    collection.countDocuments(filter),
                ]);

                const totalPages = Math.ceil(total / limitNum);

                const response: PaginatedDestinations = {
                    data: docs.map(toDestinationDTO),
                    total,
                    page: pageNum,
                    totalPages,
                    hasMore: pageNum < totalPages,
                };

                res.json(response);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: "Failed to fetch destinations" });
            }
        });


        app.get("/api/destinations/:id", async (req, res) => {
            try {
                const { id } = req.params;
                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid destination id" });
                }

                const doc = await destinationsCollection.findOne({ _id: new ObjectId(id) });
                if (!doc) {
                    return res.status(404).json({ message: "Destination not found" });
                }

                res.json(toDestinationDTO(doc));
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: "Failed to fetch destination" });
            }
        });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.listen(PORT, () => {
            console.log(`Auralis server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
    }
}
run().catch(console.dir);


