import yaml from 'js-yaml';

class AssetParser {
    static parseAsset(yamlData) {
        const instanceRegex = /--- !u!(\d+) &(-?\d+)([\s\S]*?)(?=--- !u!|$)/g;
        let match;
        let instances = [];

        while ((match = instanceRegex.exec(yamlData)) !== null) {
            const instanceId = match[2];
            const instanceData = match[3].trim().split('\n');
            const instanceType = instanceData.shift().replace(':\r', '');

            const instance = {
                id: instanceId,
                type: instanceType,
                data: yaml.load(instanceData.join('\n')),
            };

            instances.push(instance);
        }
        return AssetParser.constructHierarchy(instances);
    }

    static constructHierarchy(instances) {
        if (instances[0] === undefined) return [];
        return instances.filter(x =>
            x.type.includes('Transform') && x.data.m_Father.fileID === 0
        ).map(x =>
            AssetParser.constructGameObject(instances, x)
        );
    }

    static constructGameObject(instances, go) {
        if (go.type.includes('Transform')) go = AssetParser.findInstanceById(instances, go.data.m_GameObject.fileID);
        go = {
            id: go.id,
            name: go.data.m_Name,
            layer: go.data.m_Layer,
            tag: go.data.m_TagString,
            isActive: (go.data.m_IsActive === 1),
            components: go.data?.m_Component
                ?.map(component => component.component.fileID)
                ?.map(id => {
                    return AssetParser.findInstanceById(instances, id);
                }),
            children: []
        };
        if (go.components !== undefined) {
            go.children = go.components
            .filter(component => component.type.includes('Transform'))
            .map(component => {
                if (component.data.m_Children === undefined) return undefined;
                return component.data.m_Children.map(child => child.fileID)
                    .map(id => AssetParser.constructGameObject(instances, AssetParser.findInstanceById(instances, id)));
            })[0];
        }
        go.components = go.components?.filter(x => !x.type.includes('Transform'));
        return go;
    }

    static findInstanceById(instances, id) {
        return instances.find(x =>
            x.id.substring(0, x.id.length - 8) === `${id}`.substring(0, `${id}`.length - 8)
        );
    }
}

export default AssetParser;