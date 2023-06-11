import React, { useState } from "react";
import { Tree, App, Typography } from "antd";

import FormatTreeTitle from "./FormatTreeTitle";
import PortfolioService from "../services/portfolio.service";

import "./SymbolTree.css";

const { Text } = Typography;

function SymbolTree({ tableDetails, pdfFileName }) {
  const [file, setFile] = useState(pdfFileName);
  const [checkedSumbols, setCheckedSymbols] = useState([]);

  console.log("Pdf Filename = ", pdfFileName);
  const { modal } = App.useApp();

  const getTreeData = (tableDetails) => {
    let root = [];
    let tableNumber = 1;
    let tableChildren = [];
    console.log(tableDetails.length);
    for (let t = 0; t < tableDetails.length; t++) {
      // formatTreeTitle(tableDetails[t]);
      const { table } = tableDetails[t];
      console.log("TableDetails[t]", tableDetails[t]);

      if (table === tableNumber) {
        tableChildren.push({
          // title: `${symbol} ${columns[0].value}`,

          // title: FormatTreeTitle(tableDetails[t]),
          title: FormatTreeTitle.formatTitle(tableDetails[t]),
          key: `${table}-${t}`,
        });
      } else {
        root.push({
          title: `Table-${tableNumber}`,
          key: `${tableNumber}`,
          children: tableChildren,
        });
        tableNumber = tableNumber + 1;
        tableChildren = [
          {
            title: FormatTreeTitle.formatTitle(tableDetails[t]),
            key: `${table}-${t}`,
          },
        ];
      }
    }
    root.push({
      title: `Table-${tableNumber}`,
      key: `${tableNumber}`,
      children: tableChildren,
    });
    console.log("Root = ", root);
    return root;
  };

  function getExtractedDetails(tableIndex) {
    const idx = parseInt(
      tableIndex.substring(tableIndex.indexOf("-") + 1, tableIndex.length)
    );
    const { table, symbol, columns } = tableDetails[idx];
    const list = (
      <ul className="pt-symboltree-ul">
        {columns.map((col, index) => (
          <li key={`${table}-${index}`}>
            <Text
              ellipsis="true"
              className="pt-symboltree-heading"
            >{`${col.heading}: `}</Text>{" "}
            <Text className="pt-symboltree-text">{col.value}</Text>
          </li>
        ))}
      </ul>
    );
    return list;
  }

  function onSelectTreeNode(selectedKeys, e) {
    console.log("Tree node Selected: ", selectedKeys, e);
    // getExtractedDetails(e.node.key);
    if (e.selected) {
      modal.info({
        title: `Details Extracted From ${pdfFileName}`,
        content: getExtractedDetails(e.node.key),
      });
    }
  }

  function onCheckTreeNode(checkedKeys, e) {
    const { checked, checkedNodes, node, halfCheckedKeys } = e;

    console.log("checked keys...", checkedKeys);
    console.log("onCheck checked, checkedNodes, node, half: ", checkedNodes);

    // TODO make sure indexes are valid below before using them.. found index is not -1
    checkedNodes.forEach((node) => {
      // console.log("tableData", tableDetails);
      const { key } = node;
      if (key.length === 1) {
        console.log("table selected", key);
      } else {
        const substring = "-";
        const start = key.indexOf(substring) + 1;
        const end = key.length;
        const index = key.substring(start, end);
        console.log(
          "add selected item to array and update checked symbols",
          key,
          parseInt(index),
          tableDetails[index]
        );
      }
    });
  }

  return (
    <Tree
      checkable
      height={500}
      showLine={true}
      treeData={getTreeData(tableDetails)}
      onSelect={onSelectTreeNode}
      onRightClick={onSelectTreeNode}
      onCheck={onCheckTreeNode}
    />
  );
}

export default SymbolTree;
