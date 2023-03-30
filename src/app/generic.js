const orderData = ({ data, ascending=true}) => {

    const ascendingValue = ascending ? 1 : -1
    const antiChrono = (a, b) => ( ascendingValue * ((a.date < b.date) ? 1 : -1) )
    
    const dataOrdered = [...data].sort(antiChrono)
    return dataOrdered
}

export {  orderData }