import $ from 'jquery';
import jQuery from 'jquery';

const serverUrl = 'http://localhost:9000'
const terminaName = 'Server';
const departmentName = 'Bar';
const userName = 'Administrator';
const ticketTypeName = 'Ticket';
const menuName = 'Bar';

$.postJSON = function (url, data, callback) {
    return jQuery.ajax({
        'type': 'POST',
        'url': serverUrl + url,
        'contentType': 'application/json',
        'data': JSON.stringify(data),
        'dataType': 'json',
        'success': callback
    });
};

export function postRefresh() {
    var updateQuery = 'mutation m{postTicketRefreshMessage(id:0){id}}';
    $.postJSON('/api/graphql', { query: updateQuery });
}

export function getMenu(callback) {
    var query = getMenuScript();
    $.postJSON('/api/graphql', { query: query }, function (response) {
        if (response.errors) {
            //handle
        } else {
            if (callback) callback(response.data.menu);
        }
    });
}

export function getProductPortions(productId, callback) {
    var query = getProductPortionsScript(productId);
    $.postJSON('/api/graphql', { query: query }, function (response) {
        if (response.errors) {
            //handle
        } else {
            if (callback) callback(response.data.portions);
        }
    });
}

export function registerTerminal(callback) {
    var query = getRegisterTerminalScript();
    $.postJSON('/api/graphql', { query: query }, function (response) {
        if (response.errors) {
            //handle
        } else {
            if (callback) callback(response.data.terminalId);
        }
    });
}

export function createTerminalTicket(terminalId, callback) {
    var query = getCreateTerminalTicketScript(terminalId);
    $.postJSON('/api/graphql', { query: query }, function (response) {
        if (response.errors) {
            //handle
        } else {
            if (callback) callback(response.data.ticket);
        }
    });
}

export function clearTerminalTicketOrders(terminalId, callback) {
    var query = getClearTerminalTicketScript(terminalId);
    $.postJSON('/api/graphql', { query: query }, function (response) {
        if (response.errors) {
            //handle
        } else {
            if (callback) callback(response.data.ticket);
        }
    });
}

export function closeTerminalTicket(terminalId, callback) {
    var query = getCloseTerminalTicketScript(terminalId);
    $.postJSON('/api/graphql', { query: query }, function (response) {
        if (response.errors) {
            //handle
        } else {
            if (callback) callback(response.data.errorMessage);
        }
    });
}

export function getTerminalExists(terminalId, callback) {
    var query = getGetTerminalExistsScript(terminalId);
    $.postJSON('/api/graphql', { query: query }, function (response) {
        if (response.errors) {
            //handle
        } else {
            if (callback) callback(response.data.result);
        }
    });
}

export function getTerminalTicket(terminalId, callback) {
    var query = getGetTerminalTicketScript(terminalId);
    $.postJSON('/api/graphql', { query: query }, function (response) {
        if (response.errors) {
            //handle
        } else {
            if (callback) callback(response.data.ticket);
        }
    });
}

export function addOrderToTicket(ticket, productId, quantity = 1, callback) {
    var query = getAddOrderToTicketQuery(ticket, productId, quantity);
    console.log(query);
    $.postJSON('/api/graphql/', { query: query }, function (response) {
        if (response.errors) {
            // handle errors
        } else {
            if (callback) callback(response.data.ticket);
        }
    });
}

export function addOrderToTerminalTicket(terminalId, productId, quantity = 1, callback) {
    var query = getAddOrderToTerminalTicketScript(terminalId, productId);
    console.log(query);
    $.postJSON('/api/graphql/', { query: query }, function (response) {
        if (response.errors) {
            // handle errors
        } else {
            if (callback) callback(response.data.ticket);
        }
    });
}

export function updateOrderPortionOfTerminalTicket(terminalId, orderUid, portion, callback) {
    var query = getUpdateOrderPortionOfTerminalTicketScript(terminalId, orderUid,portion);
    console.log(query);
    $.postJSON('/api/graphql/', { query: query }, function (response) {
        if (response.errors) {
            // handle errors
        } else {
            if (callback) callback(response.data.ticket);
        }
    });
}



function getMenuScript() {
    return `{menu:getMenu(name:"${menuName}"){categories{id,name,color,foreground,menuItems{id,name,color,foreground,productId}}}}`;
}

function getProductPortionsScript(productId) {
    return `{portions:getProductPortions(productId:${productId}){id,name,price}}`;
}

function getRegisterTerminalScript() {
    return `mutation m{terminalId:registerTerminal(
        terminal:"${terminaName}",
        department:"${departmentName}",
        user:"${userName}",
        ticketType:"${ticketTypeName}")}`;
}

function getCreateTerminalTicketScript(terminalId) {
    return `mutation m{
            ticket:createTerminalTicket(terminalId:"${terminalId}")
        ${getTicketResult()}}`;
}

function getGetTerminalTicketScript(terminalId) {
    return `mutation m{
            ticket:getTerminalTicket(terminalId:"${terminalId}")
        ${getTicketResult()}}`;
}

function getClearTerminalTicketScript(terminalId) {
    return `mutation m{
            ticket:clearTerminalTicketOrders(terminalId:"${terminalId}")
        ${getTicketResult()}}`;
}

function getUpdateOrderPortionOfTerminalTicketScript(terminalId,orderUid,portion) {
    return `mutation m {ticket:updateOrderPortionOfTerminalTicket(
        terminalId:"${terminalId}",orderUid:"${orderUid}",portion:"${portion}")
    ${getTicketResult()}}`;
}

function getCloseTerminalTicketScript(terminalId) {
    return `mutation m{
            errorMessage:closeTerminalTicket(terminalId:"${terminalId}")}`;
}

function getGetTerminalExistsScript(terminalId) {
    return `mutation m{
            result:getTerminalExists(terminalId:"${terminalId}")}`;
}

function getAddOrderToTerminalTicketScript(terminalId, productId) {
    return `mutation m{
            ticket:addOrderToTerminalTicket(terminalId:"${terminalId}",
            productId:${productId})
        ${getTicketResult()}}`;
}

function getTicketResult() {
    return `{id,uid,type,number,date,totalAmount,remainingAmount,
  states{stateName,state},
  tags{tagName,tag},
	orders{
    id,
    uid,
    productId,
    name,
    quantity,
    portion,
    price,
    priceTag,
    calculatePrice,
    increaseInventory,
    decreaseInventory,
    tags{
      tag,tagName,price,quantity,rate,userId
    },
    states{
      stateName,state,stateValue
    }}
}`;
}

function getAddOrderToTicketQuery(ticket, menuItem, quantity = 1) {
    var {totalAmount, remainingAmount,...ticket2} = ticket;
    var ticketStr = JSON.stringify(ticket2);
    ticketStr = ticketStr.replace(/\"([^(\")"]+)\":/g, '$1:');

    return `
mutation m{ticket:addOrderToTicket(
  ticket:${ticketStr},menuItem:"${menuItem}",quantity:${quantity}
){id,uid,type,number,date,totalAmount,remainingAmount,
  states{stateName,state},
	orders{
    id,
    uid,
    name,
    quantity,
    portion,
    price,
    calculatePrice,
    increaseInventory,
    decreaseInventory,
    tags{
      tag,tagName,price,quantity,rate,userId
    },
    states{
      stateName,state,stateValue
    }}
}}`;
}