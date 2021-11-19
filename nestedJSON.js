'user strict';

//response untuk nested
exports.nestedJSON = function(values, res){
    //lakukan akumulasi
    const hasil = values.reduce((akumulasikan, item)=>{
        //tentukan key group
        if(akumulasikan[item.dora_id]){
            //buat variabel group dora_id
            const group = akumulasikan[item.dora_id];
            //cek jika isi array adalah bahan_id
            if(Array.isArray(group.bahan_id)){
                //tambahkan value ke dalam group bahan_id
                group.bahan_id.push(item.bahan_id);
                group.resep_qty.push(item.resep_qty);
            }else {
                group.bahan_id = [group.bahan_id, item.bahan_id];
                group.resep_qty = [group.resep_qty, item.resep_qty];
            }
        }else {
            akumulasikan[item.dora_id] = item;
        }
        return akumulasikan;
    }, {});

    var data = {
        'values':hasil
    };
    
     res.json(data);
     res.end();

}