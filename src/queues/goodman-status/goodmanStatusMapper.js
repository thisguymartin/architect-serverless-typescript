const goodmanStatusHandler = (orderStatus) => {
    const items = orderStatus.order.details.map((d) => ({
        sku: d.sku,
        serialNumbers: d.serialNumbers[0],
        orderNumber: d.orderNumber,
        description: d.description,
        quantityOrdered: d.quantityOrdered,
        quantityShipped: d.quantityShipped,
        unitPrice: d.unitPrice,
        linePrice: d.linePrice,
        discountPercent: d.discountPercent,
        quantityAvailable: d.quantityAvailable,
    })) || [];
    const SibiStatus = {
        orderNumber: orderStatus.order.orderNumber,
        branchNumber: orderStatus.order.branchNumber,
        jobName: orderStatus.order.jobName,
        orderStatusCode: orderStatus.order.orderStatusCode,
        pickStatusCode: orderStatus.order.pickStatusCode,
        pickStatusLabel: orderStatus.order.pickStatusLabel,
        items,
    };
    return SibiStatus;
};

module.exports = goodmanStatusHandler
