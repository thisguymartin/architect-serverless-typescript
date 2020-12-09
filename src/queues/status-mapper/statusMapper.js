"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusMapper = (items) => {
    console.log("statusMapper", items);
    const statuses = items.map(i => ({ SampleMaterial: i.sample_material, Material: i.material_usage }));
    return statuses;
};
exports.default = statusMapper;
