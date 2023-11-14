/* eslint-disable quotes */
import React from "react";
// eslint-disable-next-line quotes
import * as d3 from "d3";
import { FishboneProps, LineConfig, NodeConfig } from "./Fishbone.types";

    type Connector = {
      between: (Node | Connector)[];
      childIdx?: number;
      index?: number;
      maxChildIdx?: number;
      totalLinks: Link[];
      vx: number;
      vy: number;
      x: number;
      y: number;
    };

    type Node = {
      children: boolean;
      index?: number;
      childIdx?: number;
      depth?: number;
      horizontal?: boolean;
      linkCount?: number;
      name: string;
      parent?: Node;
    };

    type Link = {
      index?: number;
      depth?: number; // Might not be undefined
      arrow?: boolean;
      source?: unknown;
      target?: unknown;
      label: unknown;
    };



const arrowElementId = "#arrow";
const margin = 50;

const Fishbone = (props: FishboneProps) => {

 
    let count = props.items?.children ? props.items.children.length : 0;
    let childChildrenCount = 0;
    
    // Define a recursive function to count children and their children
    function countChildren(children: any[]) {
        children.forEach((child) => {
            if (child.children && Number.isInteger(child.children.length)) {
                count += child.children.length; // Count immediate children
                
                
    
                if (child.children.length > 0) {
                    // Recursively count the children of this child
                    countChildren(child.children);
                    childChildrenCount += child.children.length;
                    
                }
            }
        });
    }
    
    if (props.items?.children) {
        props.items.children.forEach((child: any) => {
            if (Number.isInteger(child.children?.length)) {
                count += child.children.length;
                console.log(count);
                
            }
    
            if (child.children.length > 0) {
                // Recursively count the children of this child
                countChildren(child.children);
                
            }
        });
    }
    
    // Calculate initial width and height based on counts
    const width_Initial =`${childChildrenCount <= 50 ? `100%` : `${100 + (childChildrenCount)}%`}`;
    const height_initial = `${count <= 50 ? `100%` : `${100 + (count)}%`}`;
    const canvasRatio = parseFloat(height_initial) / parseFloat(width_Initial);
    const paperRatio = 1.41421;

    // Calculate the canvas aspect ratio correction factor for the canvas
    const aspectRatioCorrection = canvasRatio > paperRatio ? canvasRatio / paperRatio : paperRatio / canvasRatio; 

    const {
        // Adjust the width and height based on the aspect ratio correction factor
        width = `${parseFloat(width_Initial) * aspectRatioCorrection}%`,
        height = `${parseFloat(height_initial) * aspectRatioCorrection}%`,
        items = [],
        linesConfig = [
            {
                color: "#000",
                strokeWidthPx: 2,
                transform: '2px'
            },
            {
                color: "#333",
                strokeWidthPx: 1,
                transform: '2px'
            },
            {
                color: "#666",
                strokeWidthPx: 0.5,
                transform: '20px'
            },
        ],
        nodesConfig = [
            {
                // color: "#000",
                color: "#0A3B3D",
                fontSizeEm: 1.5,
            },
            {
                // color: "#111",
                color: "#4CCEBD",
                fontSizeEm: 1.2,
            },
            {
                color: "#444",
                fontSizeEm: 1,
            },
            {
                color: "#888",
                fontSizeEm: 0.9,
            },
            {
                color: "#aaa",
                fontSizeEm: 0.8,
            },
        ],
        wrapperStyle,
    } = props;
    

    const ref = React.useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const lineConfigWithoutOverflow = React.useCallback(
        (index: number | undefined): LineConfig => {
            if (!index || index < 0) return linesConfig[0];

            const maxIndex = linesConfig.length - 1;

            return linesConfig[
            // Minimum of `total` and `maxIndex`
                maxIndex ^ ((index ^ maxIndex) & -(index < maxIndex))
            ];
        },
        [linesConfig]
    );

    const nodeConfigWithoutOverflow = React.useCallback(
        (index: number | undefined): NodeConfig => {
            if (!index || index < 0) return nodesConfig[0];

            const maxIndex = nodesConfig.length - 1;
            // console.log(maxIndex);
            

            return nodesConfig[
            // Minimum of `total` and `maxINdex`
                maxIndex ^ ((index ^ maxIndex) & -(index < maxIndex))
            ];
        },
        [nodesConfig]
    );


    const perNodeTick = (d: unknown) => undefined;

    // const linkScale = d3.scaleLog().domain([1, 5]).range([60, 30]);
    const linkScale = d3.scaleLog([1, 5],[60, 30]);

    const initialize = () => {
        const nodes: any[] = [];
        const links: any[] = [];
        let node: any = '',
            link: any = '',
            root: any = '';

        // eslint-disable-next-line prefer-const
        let force: d3.Simulation<any, undefined> | undefined = undefined;
        

        const svg = d3
            .select(ref.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .datum(items);

        const defs = svg.append("defs").data([1]);

        const svgElement = svg.selection().node();
        

        const svgWidth = () => svgElement?.clientWidth || 0;
        const svgHeight = () => svgElement?.clientHeight || 0;


       
        function buildNodes(node: any) {
            nodes.push(node);
            let cx = 0;
            let between = [node, node.connector];
            const nodeLinks = [{
                source: node,
                target: node.connector,
                arrow: true,
                depth: node.depth || 0,
            }];
            let prev: any;
            let childLinkCount;
            if (!node.parent) {                                                  
                nodes.push((prev = { tail: true }));
                between = [prev, node];
                nodeLinks[0].source = prev;
                nodeLinks[0].target = node;
                node.horizontal = true;
                node.vertical = false;
                node.depth = 0;
                node.root = true;
                node.totalLinks = [];
            } else {
                node.connector.maxChildIdx = 0;
                node.connector.totalLinks = [];
            }
            node.linkCount = 1;
        
            // Determine if the children should be placed opposite each other
            const placeOpposite = true; // Always place children opposite each other
        
            (node.children || []).forEach(function (child: any, idx: number) {
                child.parent = node;
                child.depth = (node.depth || 0) + 1;
                child.childIdx = idx;
                child.region = placeOpposite ? (idx % 2 === 1 ? 2 : -1) : (node.region ? node.region : idx & 1 ? 2 : -1);
                child.horizontal = !node.horizontal;
                child.vertical = !node.vertical;
        
                if (node.root && prev && !prev.tail) {
                    nodes.push(
                        (child.connector = {
                            between: between,
                            childIdx: prev.childIdx,
                        })
                    );
                    prev = null;
                } else {
                    nodes.push(
                        (prev = child.connector = { between: between, childIdx: cx++ })
                    );
                }
        
                nodeLinks.push({
                    source: child,
                    target: child.connector,
                    depth: child.depth,
                    arrow: false,
                });
        
                childLinkCount = buildNodes(child);
                node.linkCount += childLinkCount;
                between[1].totalLinks.push(childLinkCount);
            });
        
            between[1].maxChildIdx = cx;
        
            Array.prototype.unshift.apply(links, nodeLinks);
        
            return node.linkCount;
        }
        

        function tick() {
            if (isDragging) return;
          
            const alpha = force?.alpha();
            const k = 6 * (alpha || 0); // Adjust the spacing factor as needed between each node
            const width = svgWidth();
            const height = svgHeight();
          
            // Iterate through nodes and update their positions
            nodes.forEach(function (d) {
                if (d.root) {
                    // Position the root node to the right edge of the canvas
                    d.x = width - (margin + root.getBBox().width);

                } else if (d.tail) {
                    // Position the tail node on the left side and center vertically
                    d.x = margin;
                    d.y = height / 2;

                } else {
                // For nodes between root and tail
                    if (d.depth === 1) {
                        // Position depth 1 nodes either at the top or bottom and adjust horizontally
                        d.y = d.region === -1 ? margin : height - margin;
                        // we can adjust the vertical display of category here by multiplying with any value e.g 0.5
                        d.x -= 10 * k * 0.5;

                    } else if (d.vertical) {
                        // Vertically adjust nodes within a region
                        d.y += k * d.region;
                        // d.x -= k;

                    } else {
                        // Horizontally adjust nodes within the same depth
                        // I multiply the value of d.x with 5 to solve the issue of branch bending n ensure perfect horizontal display 
                        d.x -= k * 5;
                    }
          
                    if (d.between) {
                        // Calculate the position of nodes in between
                        const a = d.between[0];
                        const b = d.between[1];
                        d.x = b.x - ((1 + d.childIdx) * (b.x - a.x)) / (b.maxChildIdx + 1);
                        d.y = b.y - ((1 + d.childIdx) * (b.y - a.y)) / (b.maxChildIdx + 1);
                        
                    }
                }
          
                perNodeTick(d);
            });
          
            // Update node positions
            node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
          
            // Update link positions
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);
        }   


        defs
            .selectAll(`marker${arrowElementId}`)
            .data([1])
            .enter()
            .append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 10)
            .attr("refY", 0)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");

        buildNodes(svg.datum());


        function calculateLinkDistance(d: { source: { children: string | any[]; }; depth: number; target: { maxChildIdx: number; }; }) {

            const data = d.source.children;
            const secondChildLength = d.source.children?.length;
            const secondChild = d.depth === 2;
            
                            
            // Recursive case: Check if the target node is the second child and has more than 2 children.
            if (data && secondChild && secondChildLength > 2) {
                return (d.target.maxChildIdx + 1) * linkScale(d.depth + 1) * 1.5;  
            }  else {
                return (d.target.maxChildIdx + 1) * linkScale(d.depth + 1);
            }
        }
            
        force = d3
            .forceSimulation(nodes)
            .nodes(nodes)
            .force(
                "link",
                d3
                    .forceLink()
                    .id((d: any) => d.id)
                    .links(links)
                    .distance((d: any) => calculateLinkDistance(d))
                // (d: any) => (d.target.maxChildIdx + 1) * linkScale(d.depth + 1)
            )
            .force("charge", d3.forceManyBody().strength(-10)); // Adjust strength as needed to prevent text collision;


        link = svg
            .selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", (d: any) => `link link-${d.depth}`)
            .attr("marker-end", (d: any) =>
                d.arrow ? `url(${arrowElementId})` : null
            )
            .style("stroke", (d: Link) => {
                return lineConfigWithoutOverflow(d.depth).color;
            })
            .style("stroke-width", (d: Link, i) => {
                const strokeWidth = lineConfigWithoutOverflow(d.depth).strokeWidthPx;

                return `${strokeWidth}px`;

            });
 
       

        const textBoxWidth = 150;

        // Define a wrap function
        function wrap(text: { each: (arg0: () => void) => void; }, width: number) {
            text.each(function () {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore: Object is possibly 'null'.
                const text = d3.select(this);
                const  words = text.text().split(/\s+/).reverse();
                let   word;
                let line: string[] = [];
                const lineHeight = 1.1; // Adjust as needed
                const y = text.attr("y");
                const  dy = parseFloat(text.attr("dy"));
                let  tspan = text
                    .text(null)
                    .append("tspan")
                    .attr("x", 0)
                    .attr("y", y);
                    
                    

                while ((word = words.pop())) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    // This is to disabled typescripts error
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore: Object is possibly 'null'.
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text
                            .append("tspan")
                            .attr("x", 0)
                            .attr("y", y)
                            .attr("dy", (lineHeight + "em"))
                            .text(word);
                    }
                }
            });
        }
        
        
        // Apply the wrap function to all text elements with class 'label'
        node = svg
            .selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", (d: any) => `node ${d.root ? "root" : ""}`);


        node
            .append("text")
            .attr("class", (d: Node) => `label-${d.depth}`)
            .style("fill", (d: Node) => {
                return nodeConfigWithoutOverflow(d.depth).color;
            })
            .attr("dy", (d: any) =>
                d.horizontal ? ".35em" : d.region === 1 ? "1em" : "-.2em"
            );
            

        node
            .append("text")
            .text((d: Node) => d.name)
            .attr("text-anchor", (d: Node) =>
                !d.depth ? "start" : d.horizontal ? "end" : "end"
            )
            .attr("dy", (d: Node) =>
                !d.depth ? "-2em" : d.horizontal ? "" : ""
            )
            .style("font-size", (d: Node, i: any) => {
                const size = nodeConfigWithoutOverflow(d.depth).fontSizeEm;
                return `${size}em`;
            })
            .style("fill", (d: Node) => 
                (d.depth === 0 ? '#4CCEBD' : (d.depth === 1 ? '#08878b' : 'black'))) // Set text color dynamically based on node properties
            .call(wrap, textBoxWidth);


        

            
      
        function clamp(x: any, lo: any, hi: any) {
            return x < lo ? lo : x > hi ? hi : x;
        }

        function click(event: any, d: any) {
            delete d.fx;
            delete d.fy;
            d3.select(event.target).classed("fixed", false);
            force?.alpha(1).restart();
        }

        const dragstart = (event: any) => {
            setIsDragging(true);
            d3.select(event.sourceEvent.target).classed("fixed", true);
        };

        function dragged(event: any, d: any) {
            d.fx = clamp(event.x, 0, svgWidth());
            d.fy = clamp(event.y, 0, svgHeight());
            force?.alpha(1).restart();
        }

        const dragend = () => {
            setIsDragging(false);
        };

        const drag = d3
            .drag()
            .on("start", dragstart)
            .on("drag", dragged)
            .on("end", dragend);

        node.call(drag).on("click", click);

        root = svg.select(".root").node();

        force.on("tick", tick);

        d3.select(window).on("resize", function () {
            svg.attr('width', svgWidth()).attr("height", svgHeight());

            const resizeFinished = setTimeout(() => {
                force?.restart();
            }, 200);

            // clearTimeout(resizeFinished);
        });
    };

    React.useEffect(() => {
        // Ref is not initialized
        if (ref.current === null) return;
        // Ref was already initialized (Caused by React.StrictMode)
        if (ref.current.children.length !== 0) return;
        // If no items passed - render nothing
        if (!items) return;

        initialize();
    }, [ref, 
        width, 
        height, 
        items, 
        linesConfig, 
        nodesConfig, 
        wrapperStyle]);

    return (
        <div ref={ref} style={wrapperStyle}>
        </div>);
};

export default Fishbone;

function getMaxDepth(parent: any) {
    throw new Error("Function not implemented.");
}

