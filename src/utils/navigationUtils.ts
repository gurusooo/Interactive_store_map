import { Product } from '../types/types';

export interface GraphNode {
    id: string;
    x: number;
    y: number;
    neighbors: string[];
}

export type Graph = Record<string, GraphNode>;

export const storeGraph: Graph = {
    'entrance': { id: 'entrance', x: 500, y: 620, neighbors: ['cross_bottom_right'] },
    'checkout': { id: 'checkout', x: 500, y: 500, neighbors: ['cross_bottom_right', 'cross_mid_right'] },

    'cross_bottom_left': { id: 'cross_bottom_left', x: 50, y: 550, neighbors: ['cross_bottom_mid', 'cross_mid_left'] },
    'cross_bottom_mid': { id: 'cross_bottom_mid', x: 250, y: 550, neighbors: ['cross_bottom_left', 'cross_bottom_right', 'cross_mid_mid'] },
    'cross_bottom_right': { id: 'cross_bottom_right', x: 450, y: 550, neighbors: ['cross_bottom_mid', 'checkout', 'cross_mid_right', 'entrance'] },

    'cross_mid_left': { id: 'cross_mid_left', x: 50, y: 300, neighbors: ['cross_bottom_left', 'cross_top_left', 'cross_mid_mid'] },
    'cross_mid_mid': { id: 'cross_mid_mid', x: 250, y: 300, neighbors: ['cross_bottom_mid', 'cross_mid_left', 'cross_mid_right', 'cross_top_mid'] },
    'cross_mid_right': { id: 'cross_mid_right', x: 450, y: 300, neighbors: ['cross_bottom_right', 'checkout', 'cross_mid_mid', 'cross_top_right'] },

    'cross_top_left': { id: 'cross_top_left', x: 50, y: 100, neighbors: ['cross_mid_left', 'cross_top_mid'] },
    'cross_top_mid': { id: 'cross_top_mid', x: 250, y: 100, neighbors: ['cross_top_left', 'cross_mid_mid', 'cross_top_right'] },
    'cross_top_right': { id: 'cross_top_right', x: 450, y: 100, neighbors: ['cross_top_mid', 'cross_mid_right'] },
};

export function findNearestGraphNode(x: number, y: number, graph: Graph = storeGraph): string {
    let nearestNodeId = '';
    let minDistance = Infinity;

    for (const nodeId in graph) {
        const node = graph[nodeId];
        const dist = Math.hypot(node.x - x, node.y - y);
        if (dist < minDistance) {
            minDistance = dist;
            nearestNodeId = nodeId;
        }
    }
    return nearestNodeId;
}

export function runDijkstra(startNodeId: string, graph: Graph = storeGraph) {
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const unvisited = new Set<string>();

    for (const nodeId in graph) {
        distances[nodeId] = Infinity;
        previous[nodeId] = null;
        unvisited.add(nodeId);
    }
    distances[startNodeId] = 0;

    while (unvisited.size > 0) {
        let currentNodeId: string | null = null;
        let minDistance = Infinity;
        for (const nodeId of unvisited) {
            if (distances[nodeId] < minDistance) {
                minDistance = distances[nodeId];
                currentNodeId = nodeId;
            }
        }

        if (currentNodeId === null || distances[currentNodeId] === Infinity) break;

        unvisited.delete(currentNodeId);
        const currentNode = graph[currentNodeId];

        for (const neighborId of currentNode.neighbors) {
            if (!unvisited.has(neighborId)) continue;

            const neighborNode = graph[neighborId];
            const edgeWeight = Math.hypot(currentNode.x - neighborNode.x, currentNode.y - neighborNode.y);
            const altDistance = distances[currentNodeId] + edgeWeight;

            if (altDistance < distances[neighborId]) {
                distances[neighborId] = altDistance;
                previous[neighborId] = currentNodeId;
            }
        }
    }

    return { distances, previous };
}

export function reconstructPath(previous: Record<string, string | null>, targetNodeId: string): string[] {
    const path: string[] = [];
    let current: string | null = targetNodeId;
    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }
    return path;
}

export function calculateOptimalRoute(
    productsInCart: Product[],
    graph: Graph = storeGraph
): { fullPathCoordinates: { x: number; y: number }[], sortedProducts: Product[] } {

    if (!productsInCart || productsInCart.length === 0) {
        const { previous } = runDijkstra('entrance', graph);
        const pathIds = reconstructPath(previous, 'checkout');
        const coords = pathIds.map(id => ({ x: graph[id].x, y: graph[id].y }));
        return { fullPathCoordinates: coords, sortedProducts: [] };
    }

    const nodeToProducts: Record<string, Product[]> = {};
    productsInCart.forEach(product => {
        const nodeId = findNearestGraphNode(product.location.x, product.location.y, graph);
        if (!nodeToProducts[nodeId]) {
            nodeToProducts[nodeId] = [];
        }
        nodeToProducts[nodeId].push(product);
    });

    const targetNodes = Object.keys(nodeToProducts);
    const nodesToMeasure = Array.from(new Set(['entrance', 'checkout', ...targetNodes]));

    const distanceMatrix: Record<string, Record<string, number>> = {};
    const pathMatrix: Record<string, Record<string, string[]>> = {};

    nodesToMeasure.forEach(startNode => {
        const { distances, previous } = runDijkstra(startNode, graph);
        distanceMatrix[startNode] = distances;
        pathMatrix[startNode] = {};

        nodesToMeasure.forEach(endNode => {
            pathMatrix[startNode][endNode] = reconstructPath(previous, endNode);
        });
    });

    let optimalNodeOrder: string[] = [];

    if (targetNodes.length <= 10) {
        let minCombinedCost = Infinity;

        const findExactPath = (
            currentNode: string,
            visitedCount: number,
            currentGraphCost: number,
            currentPath: string[],
            visitedSet: Set<string>
        ) => {
            if (currentGraphCost >= minCombinedCost) return;

            if (visitedCount === targetNodes.length) {
                const finalGraphCost = currentGraphCost + (distanceMatrix[currentNode]?.[ 'checkout' ] ?? Infinity);

                let totalEuclidean = 0;
                let lastX = graph['entrance'].x;
                let lastY = graph['entrance'].y;

                for (const nodeId of currentPath) {
                    const prod = nodeToProducts[nodeId][0];
                    if (prod && prod.location) {
                        totalEuclidean += Math.hypot(prod.location.x - lastX, prod.location.y - lastY);
                        lastX = prod.location.x;
                        lastY = prod.location.y;
                    }
                }
                totalEuclidean += Math.hypot(graph['checkout'].x - lastX, graph['checkout'].y - lastY);

                const combinedCost = finalGraphCost + totalEuclidean * 0.1;

                if (combinedCost < minCombinedCost) {
                    minCombinedCost = combinedCost;
                    optimalNodeOrder = [...currentPath];
                }
                return;
            }

            for (const nextNode of targetNodes) {
                if (!visitedSet.has(nextNode)) {
                    visitedSet.add(nextNode);
                    currentPath.push(nextNode);

                    findExactPath(
                        nextNode,
                        visitedCount + 1,
                        currentGraphCost + (distanceMatrix[currentNode]?.[nextNode] ?? Infinity),
                        currentPath,
                        visitedSet
                    );

                    currentPath.pop();
                    visitedSet.delete(nextNode);
                }
            }
        };

        findExactPath('entrance', 0, 0, [], new Set<string>());
    } else {
        let currentNodeId = 'entrance';
        const remainingNodes = new Set(targetNodes);
        while (remainingNodes.size > 0) {
            let closestNode: string | null = null;
            let minDistance = Infinity;
            for (const targetNode of remainingNodes) {
                const dist = distanceMatrix[currentNodeId]?.[targetNode] ?? Infinity;
                if (dist < minDistance) {
                    minDistance = dist;
                    closestNode = targetNode;
                }
            }
            if (closestNode && minDistance !== Infinity) {
                optimalNodeOrder.push(closestNode);
                currentNodeId = closestNode;
                remainingNodes.delete(closestNode);
            } else {
                break;
            }
        }
    }

    const sortedProducts: Product[] = [];
    const fullPathNodeIds: string[] = [];

    let currentNodeId = 'entrance';
    fullPathNodeIds.push(currentNodeId);

    optimalNodeOrder.forEach(nextNodeId => {
        const subPath = pathMatrix[currentNodeId][nextNodeId];
        if (subPath && subPath.length > 1) {
            fullPathNodeIds.push(...subPath.slice(1));
        }

        const productsInNode = [...nodeToProducts[nextNodeId]];

        const referenceNodeId = subPath && subPath.length > 1
            ? subPath[subPath.length - 2]
            : currentNodeId;

        const refNode = graph[referenceNodeId];

        productsInNode.sort((a, b) => {
            const distA = Math.hypot(a.location.x - refNode.x, a.location.y - refNode.y);
            const distB = Math.hypot(b.location.x - refNode.x, b.location.y - refNode.y);
            return distA - distB;
        });

        sortedProducts.push(...productsInNode);

        currentNodeId = nextNodeId;
    });

    const finalSubPath = pathMatrix[currentNodeId]['checkout'];
    if (finalSubPath && finalSubPath.length > 1) {
        fullPathNodeIds.push(...finalSubPath.slice(1));
    }

    const fullPathCoordinates = fullPathNodeIds.map(id => ({ x: graph[id].x, y: graph[id].y }));

    return { fullPathCoordinates, sortedProducts };
}