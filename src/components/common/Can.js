import rules from "../../config/accessRules";
import { connect } from "react-redux";

const Can = (props) => {
    console.log("Can Component".padEnd(30,"*"), props,rules);
    const { perform = "", show="", auth: { role= "" } = {} } = props;
    const [component = "", action = ""] = perform.split(":");

    const getAction = action => {
        switch (action) {
            case 'R': return "read";
            case 'W': return "write";
            case 'V': return "visit";
            default: return null;
        }
    }

    const getRole = role => {
        switch (role) {
            case 1: return "admin";
            case 2: return "provider";
            case 3: return "retailer";
            default: return "endUser";
        }
    }

    const check = () => {
        let allow = false;

        //check wheather component is defined in the rule
        const isComponentPresent = ( rules.components.static.includes(component)
            || rules.components.dynamic[component]) || false;
        
        const currentRole = getRole(role);
        
        //allow only if rule has the requested component
        allow = isComponentPresent; 

        //verify with role to allow access if the component is private
        if (isComponentPresent && !rules.components.static.includes(component) && rules.components.dynamic[component]) {
            const performAction = getAction(action);
            allow = performAction && (performAction === "visit" || rules.components.dynamic[component](currentRole , performAction));
        }

        //verify that any of the defined UI element in rules has the aprropriate permision to display
        if (!!show) {
            allow = !rules.dynamicUIElement[show] || rules.dynamicUIElement[show](currentRole)
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