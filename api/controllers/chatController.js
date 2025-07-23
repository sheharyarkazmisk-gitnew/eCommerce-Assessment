const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyANSTr3V_YaC7eYoQpGHTE6PZS2LgS5gDA");

exports.handleChat = async (req, res) => {
    const { message } = req.body;

    try {
        // Fetch product data from FakeStoreAPI
        const productsResponse = await fetch('https://fakestoreapi.com/products/');
        const products = await productsResponse.json();

        // Format product data for the prompt
        const productData = products.map(product => 
            `ID: ${product.id}, Title: ${product.title}, Price: ${product.price}, Category: ${product.category}, Description: ${product.description}`
        ).join('\n');

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

        const prompt = `You are a helpful assistant for an e-commerce store. Answer the following question based ONLY on the provided product information. If the answer is not in the provided information, state that you don't have enough information.

Product Information:
${productData}

User Question: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.json({ reply: text });
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: `Failed to generate content: ${error.message}` });
    }
};