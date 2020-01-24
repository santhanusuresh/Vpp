const actions = ["read", "write"];
const roles = ["admin","provider", "retailer","endUser"];
const hasPermision = (role = "", action = []) => action.includes(role);
const ruleSkeleton = () => ({ components: { static: [], dynamic: {} }, dynamicUIElement: {} });

const rules = ruleSkeleton();
rules.components.static = ["Dashboard", "Login", "Events", "Fleet", "EditEvent"];
rules.components.dynamic = {
    "AddEvent": (role, action) => {
        const permissions = {
            [actions[0]]: [...roles], //read => all roles
            [actions[1]]: [roles[0], roles[1]] //write => admin && provider (Ausgrid)
        };
        console.log("******AddEvent Rule***********",role, permissions[action])
        return hasPermision(role, permissions[action]);
    },
    "LocationFilter": (role, action) => {
        const permissions = {
            [actions[0]]: [roles[0], roles[1]], //read => admin && provider (Ausgrid)
            [actions[1]]: [roles[0], roles[1]] //write => admin && provider (Ausgrid)
        };
        console.log("******LocationFilter Rule***********",role, permissions[action])
        return hasPermision(role, permissions[action]);
    }
};
rules.dynamicUIElement = {
    "AddEventButton": (role) => {
        const permissions = [roles[0], roles[1]] //show => admin && provider (Ausgrid)
        console.log("******AddEventButton Rule***********",role, permissions)
        return permissions.includes(role);
    },
    "ExportButton": (role) => {
        const permissions = [roles[0], roles[1]] //show => admin && provider (Ausgrid)
        console.log("******ExportButton Rule***********",role, permissions)
        return permissions.includes(role);
    }
}

export default rules;