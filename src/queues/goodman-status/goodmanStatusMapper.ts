const goodmanStatusHandler = (orderStatus: { order: { details: any[]; orderNumber: any; branchNumber: any; jobName: any; orderStatusCode: any; pickStatusCode: any; pickStatusLabel: any; }; }) => {
    const items = orderStatus.order.details.map((d: { sku: any; serialNumbers: any[]; orderNumber: any; description: any; quantityOrdered: any; quantityShipped: any; unitPrice: any; linePrice: any; discountPercent: any; quantityAvailable: any; }) => ({
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

export default goodmanStatusHandler
