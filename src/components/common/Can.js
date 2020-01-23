import rules from "../../config/accessRules";
import { connect } from "react-redux";

const Can = (props) => {
    console.log("Can Component".padEnd(30,"*"), props,rules);
    const { perform = "", show="", auth: {user: role="user", module: userModule=""} = {} } = props;
    const [component = "", action = ""] = perform.split(":");

    const getAction = action => {
        switch (action) {
            case 'R': return "read";
            case 'W': return "write";
            case 'V': return "visit";
            default: return null;
        }
    }

    const check = () => {
        let allow = false;

        //check wheather module is defined in rules
        const currentModule = userModule && rules.modules[userModule];

        //check wheather component is defined in the current module
        const isComponentPresent = (currentModule && (currentModule.components.static.includes(component)
            || currentModule.components.dynamic[component])) || false;
        
        //allow only if current module has requested component
        allow = isComponentPresent; 

        //verify with role to allow access if the component is private
        if (isComponentPresent && !currentModule.components.static.includes(component) && currentModule.components.dynamic[component]) {
            const performAction = getAction(action);
            allow = performAction && (performAction === "visit" || currentModule.components.dynamic[component](role , performAction));
        }

        //verify that any of the defined UI element in rules has the aprropriate permision to display
        if (!!show) {
            allow = !currentModule.dynamicUIElement[show] || currentModule.dynamicUIElement[show](role)
        }

        return (allow && "yes") || "no";
    }
    
    return  props[check()]() ;
}

Can.defaultProps = {
    yes: () => null,
    no: () => null
  };

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Can);