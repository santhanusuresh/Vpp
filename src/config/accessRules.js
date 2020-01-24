const actions = ["read", "write"];
const roles = ["admin", "vendor", "user"];
const hasPermision = (role = "", action = []) => action.includes(role);
const createNewRule = (moduleName) => ({ [moduleName]: { components: { static: [], dynamic: {} }, dynamicUIElement: {} } });

//PowerShop Module
const { powerShop } = createNewRule("powerShop");
powerShop.components.static = ["Dashboard", "Login", "Events", "Fleet", "EditEvent"];
powerShop.components.dynamic = {
    "AddEvent": (role, action) => {
        const permissions = {
            [actions[0]]: [...roles], //read => all roles
            [actions[1]]: [roles[0]] //write => only admin
        };
        return hasPermision(role, permissions[action]);
    },
    "LocationFilter": (role, action) => {
        const permissions = {
            [actions[0]]: [roles[0]], //read => only admin
            [actions[1]]: [roles[0]] //write => only admin
        };
        return hasPermision(role, permissions[action]);
    }
};
powerShop.dynamicUIElement = {
    "AddEventButton": (role) => {
        const permisions =  [roles[0]] //show => only admin
        return permisions.includes(role);
    }
}

//Ausgrid Module
const { ausgrid } = createNewRule("ausgrid");
ausgrid.components.static = ["Dashboard", "Login", "Fleet", "EditEvent"];
ausgrid.components.dynamic = {
    "AddEvent": (role, action) => {
        const permissions = {
            [actions[0]]: [...roles], //read => all roles
            [actions[1]]: [roles[0]] //write => only admin
        };
        return hasPermision(role, permissions[action]);
    }
};
ausgrid.dynamicUIElement = {
    "AddEventButton": (role) => {
        const permisions =  [roles[0]] //show => only admin
        return permisions.includes(role);
    }
}

const rules = { modules: { powerShop, ausgrid } };
export default rules;