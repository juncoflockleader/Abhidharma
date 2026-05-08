function buildCittaModel(raw) {
    const columnDefinitions = [];
    const columnIndex = {};
    const topHeaders = raw.data.columns_header || [];

    (topHeaders[0] ? [topHeaders[0]] : []).forEach((header, idx) => {
        const columnId = `column-${idx}`;
        const column = { columnId, displayName: header.name, groupId: null, subgroupId: null };
        columnDefinitions.push(column);
        columnIndex[columnId] = column;
    });

    const nestedHeader = topHeaders[2] || { children: [] };
    (nestedHeader.children || []).forEach((group, groupIndex) => {
        (group.children || []).forEach((subgroup, subgroupIndex) => {
            const columnId = `column-${columnDefinitions.length}`;
            const column = {
                columnId,
                displayName: subgroup.name,
                groupId: `column-group-${groupIndex}`,
                groupDisplayName: group.name,
                subgroupId: `column-subgroup-${groupIndex}-${subgroupIndex}`,
                topGroupId: 'column-group-main',
                topGroupDisplayName: nestedHeader.name,
            };
            columnDefinitions.push(column);
            columnIndex[columnId] = column;
        });
    });

    const rowDefinitions = (raw.data.rows_header || []).map((name, index) => ({
        rowId: `row-${index}`,
        displayName: name,
        cittaGroupIds: (raw.data.cells_citta_group[index] || []).map((_, colIndex) => {
            return (raw.data.cells_citta_group[index][colIndex] || []).map(cg => `citta-group-${cg}`);
        })
    }));

    const cittaGroups = (raw.cittas.children || []).map((group, index) => {
        const groupId = `citta-group-${index}`;
        return {
            groupId,
            displayName: group.name,
            notes: group.notes || [],
            childrenIds: (group.children || []).map(child => child.id),
            raw: group,
        };
    });

    const cittaGroupIndex = Object.fromEntries(cittaGroups.map(g => [g.groupId, g]));

    const cetasikaGroups = (raw.cetasika.children || []).map((group, groupIndex) => ({
        groupId: `cetasika-group-${groupIndex}`,
        displayName: group.name,
        childrenIds: (group.children || []).map((_, subIndex) => `cetasika-subgroup-${groupIndex}-${subIndex}`),
        children: (group.children || []).map((subGroup, subIndex) => ({
            groupId: `cetasika-subgroup-${groupIndex}-${subIndex}`,
            displayName: subGroup.name,
            childrenIds: (subGroup.children || []).map(child => child.id),
            children: subGroup.children || [],
            notes: subGroup.notes || [],
        })),
        notes: group.notes || [],
    }));

    return {
        header: {
            rowHeader: raw.data.header.row_header,
            columnHeader: raw.data.header.column_header,
        },
        columnDefinitions,
        columnIndex,
        rowDefinitions,
        cittaGroups,
        cittaGroupIndex,
        cetasika: {
            name: raw.cetasika.name,
            groups: cetasikaGroups,
        },
        indexes: {
            cittaById: Object.fromEntries(cittaGroups.flatMap(g => (g.raw.children || []).map(item => [item.id, item]))),
        }
    };
}
