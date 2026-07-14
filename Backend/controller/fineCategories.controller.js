const FineCategory = require("../model/fineCategories.model");

const fineCategories = async (req, res) => {
    try {
        const data = await FineCategory.find({});
        return res.status(200).json(data);

    } catch (error) {

        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error while fetching fine categories"
        });
    }
};

module.exports = {
    fineCategories
};