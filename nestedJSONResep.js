'user strict';

//response untuk nested
exports.nestedJSONResep = function(values, res){
    //lakukan akumulasi
    const hasil = values.reduce((akumulasikan, item)=>{
        //tentukan key group
        if(akumulasikan[item.dora_name]){
            //buat variabel group dora_name
            const group = akumulasikan[item.dora_name];
            //cek jika isi array adalah bahan_id
            if(Array.isArray(group.bahan_name)){
                //tambahkan value ke dalam group bahan_id
                group.bahan_name.push(item.bahan_name);
                group.resep_qty.push(item.resep_qty);
            }else {
                group.bahan_name = [group.bahan_name, item.bahan_name];
                group.resep_qty = [group.resep_qty, item.resep_qty];
            }
        }else {
            akumulasikan[item.dora_name] = item;
        }
        return akumulasikan;
    }, {});

    var data = {
        'values':hasil
    };
    
     res.json(data);
     res.end();

}