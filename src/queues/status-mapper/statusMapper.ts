interface StatusMap {
    SampleMaterial: string
    Material: string
}
const statusMapper = (items): StatusMap[] => {
    console.log("statusMapper", items)
    const statuses: StatusMap[] = items.map(i => ({ SampleMaterial: i.sample_material, Material: i.material_usage }))
    return statuses
};

export default statusMapper

