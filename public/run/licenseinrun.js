class LIN_BaseJig extends Jig {
  init(opts) {
    super.init()
    this.className = "LIN_BaseJig";
    this.name = opts.name || "";
    this.setTitle(opts.title, opts.description);
  }
  id(){ return this.origin; }
  setTitle(t, d){
    this.title = t || "";
    this.description = d || "";
  }
  deposit(val){
    this.satoshis += val || 0;
  }
  withdraw(val){
    this.satoshis -= val || 0;
  }
  balance(){
    return this.satoshis || 0;
  }
  send(to){
    this.owner = to;
  }
}
LIN_BaseJig.title = "LIN_BaseJig";
LIN_BaseJig.version = "0.1.0";




class LIN_Payment extends Jig {
  init(owner, satoshis, title, descr) {
    expect(caller).toBeInstanceOf(LIN_LicenseContract, "Only licenses can make payments")
    this.className = "LIN_Payment";
    this.owner = owner
    this.satoshis = satoshis
    this.name = "Payment Received!"
    this.title = title || caller.title;
    this.description = descr || caller.description;
    this.from = {
      origin: caller.origin,
      location: caller.location,
      owner: caller.owner
    }
  }
  redeem(cdt){
    this.satoshis = 0;
    this._redeem_at = cdt;
    this.destroy();
  }
}
LIN_Payment.title = "LIN_Payment";
LIN_Payment.version = "0.1.0";

class LIN_BucketContract extends LIN_BaseJig {
  init(opts) {
    super.init(opts);
    this.className = "LIN_BucketContract";
    this.children = [];
    this._c_at = opts.c_at || -1;
    this._dstr_at = -1;
  }
  newChild(opts, dsp_to){
    const jig = new LIN_LicenseContract(opts, dsp_to || opts.dsp_to || "");
    this.children.push(jig)
    return jig;
  }

  getChild(idx){
    return this.children[idx];
  }

  debugChild(idx) {
    console.log("LIN_BucketContract debug child: ", idx);
    this.children[idx].debug();
  }


  getCanA(){ return this.children.filter(c=>c.canA()) }
  cntCanA(){ return (this.getCanA() || []).length; }

  getCanDsp(){ return this.children.filter(c=>c.canDsp()) }
  cntCanDsp(){ return (this.getCanDsp() || []).length; }

  getCanP(){ return this.children.filter(c=>c.canP()) }
  cntCanP(){ return (this.getCanP() || []).length; }

  getX(){ return this.children.filter(c=>c.isX()) }
  cntX(){ return (this.getX() || []).length; }

  getVld(){ return this.children.filter(c=>c.isVld()) }
  cntVld(){ return (this.getVld() || []).length; }

  send() {
    throw new Error("Can not send a bucket")
  }

  deposit() {
    throw new Error("Can not deposit on a bucket")
  }

  withdraw() {
    throw new Error("Can not withdraw from a bucket")
  }

  destroy(cdt){
    expect(this.cntVld()).toBe(0, "Can not destroy a bucket with valid licenses.")
    this._dstr_at = cdt;
    super.destroy(cdt);
  }

}
LIN_BucketContract.title = "LIN_BucketContract";
LIN_BucketContract.version = "0.1.0";



class LIN_LicenseContract extends LIN_BaseJig {
  init(opts, dsp_to) {
    opts = opts || {};
    super.init(opts);

    // Constants
    this.className = "LIN_LicenseContract";

    // Expectations
    expect(caller).toBeInstanceOf(LIN_BucketContract)
    expect(opts.c_at).toBeInteger("Creation date is invalid")

    //
    this.parent = {
      origin: caller.origin,
      location: caller.location,
      owner: caller.owner
    };

    // Configurations
    this.cnf(opts);

    // Privates
    this._c_at = opts.c_at;
    this._a_at = -1;
    this._d_at = -1;
    this._dstr_at = -1;
    this._cnc_at = -1;
    this._vrf_at = -1;
    this._c_cnt = 0;
    this._p_h = [];
    this._p_l_a = -1;
    this._p_c_x_at = -1;
    this._x_at = -1;
    
    if (dsp_to > "") this.dispatch(opts.c_at, dsp_to);

  }

  cnf(opts){
    // Validations
    if (!opts.c_id) throw new Error("Creation date in missing");
    if (!opts.p_ad) throw new Error("Payment address is missing");
    if (!Array.isArray(opts.p_ad)) throw new Error("Payments must be an array");
    
    // Configuration
    this.setTitle(opts.title, opts.description);
    this.c_id = opts.c_id || "";
    this.c_lft = opts.c_lft || -1;
    this.cclb = opts.cclb === false ? false : true;
    this.trsf = opts.trsf === false ? false : true;
    this.verfbl = opts.verfbl === true ? true : false;
    //
    this.p_ad = opts.p_ad || ["", 1.0];
    this.p_c_max = opts.p_c_max || -1;
    this.p_c_tu = opts.p_c_tu || 60 * 60;
    this.p_c_pr = opts.p_c_pr || 1000;
    this.p_c_min = opts.p_c_min || 1;

    this.pld = opts.pld || {};
  }

  exp(){
    return {
      name: this.name,
      title: this.title,
      description: this.description,
      c_id: this.c_id,
      c_lft: this.c_lft,
      cclb: this.cclb,
      trsf: this.trsf,
      p_ad: this.p_ad,
      p_c_max: this.p_c_max,
      p_c_tu: this.p_c_tu,
      p_c_pr: this.p_c_pr,
      p_c_min: this.p_c_min,
      pld: this.pld,
      verfbl: this.verfbl
    }
  }

  // Values
  minDep() { return this.p_c_min * this.p_c_pr; }
  minTuSz() { return this.p_c_min * this.p_c_tu; }
  reqMinDep() {
    const dbt = (this.p_c_min - this._c_cnt) * this.p_c_pr;
    return ( dbt < 0 ) ? 0 : dbt;
  }
  dbtSz() {
    const dpsz = !this.isA() ? this.reqMinDep() - this.satoshis : this.p_c_pr - this.satoshis;
    return dpsz < 0 ? 0 : dpsz;
  }
  lifeTm() { 
    const mts = this.minTuSz();
    return (this.c_lft > mts) ? this.c_lft : mts; 
  }
  lifeTmLft(cdt) { 
    const lf = this._x_at - cdt; 
    return (lf < 0) ? 0 : lf;
  }
  lifeLft(cdt) { 
    const lf = this._p_c_x_at - cdt; 
    return (lf < 0) ? 0 : lf;
  }

  // Conditions
  isParOwn() { return this.owner == this.parent.owner; }
  isA() { return this._a_at > 0; }
  isCnc() { return this._cnc_at > 0; }
  isD() { return this._d_at > 0; }
  isDstr() { return this.owner == null; }
  isX(cdt) { return (this._x_at > 0 && this._x_at < cdt) || (this.isPCX(cdt) && this._c_cnt == this.p_c_max); }
  isPCX(cdt) { return this._p_c_x_at > 0 && this._p_c_x_at < cdt; }
  isGteMin() { return this._c_cnt >= this.p_c_min; }
  isLtMax() { return this.p_c_max <= 0 || this._c_cnt < this.p_c_max; }
  isLteMax() { return this.p_c_max <= 0 || this._c_cnt <= this.p_c_max; }
  hasLifeTmNext(cdt){ 
    return this._x_at == -1 || (this.lifeTmLft(cdt) >= (this.lifeLft(cdt) + this.p_c_tu)); 
  }

  hasPayBal() {
    return this.isA() ? this.satoshis >= this.p_c_pr : this.satoshis >= this.minDep();
  }
  canA(){
    return this.isD() && !this.isA() && !this.isParOwn() && !this.isCnc();
  }
  canP() {
    return !this.isParOwn()
      && this.isA()
      && !this.isX()
      && this.isLtMax()
      && this.hasPayBal();
  }
  canCnc(){
    return !this.isDstr()
    && (
      (this.isParOwn() && (!this.isD() || (this.isD() && this.isCnc())))
      || (
        this.cclb 
        && (
          !this.isA()
          || 
          (this.isA() && !this.isX() && this.isGteMin())
        )
      )
    );
  }
  canDsp(){
    return this.isParOwn() && !this.isA() && !this.isCnc() && !this.isX();
  }
  canS(){
    return this.trsf && !this.isParOwn() && !this.isX() && !this.isCnc();
  }
  canDep(){
    return !this.isParOwn() && !this.isX() && !this.isCnc();
  }
  canW(){
    return  this.satoshis > 0
      && (
        this.isParOwn() 
        || !this.isA()
        || (!this.isX() && !this.isCnc())
      );
  }
  canDstr(){
    return !this.isDstr() && this.isParOwn();
  }
  isVld(cdt){
    return this.isA() && !this.isX(cdt) && !this.isPCX(cdt) && this.isLteMax();
  }
  
  _ensureNotPCX(cdt, msg) { if (this.isPCX(cdt)) throw new Error(msg || "License round is expired"); }
  _ensureNotX(cdt, msg) { if (this.isX(cdt)) throw new Error(msg || "License is expired"); }
  _ensureNotCnc(msg) { if (this.isCnc()) throw new Error(msg || "License is cancelled"); }
  _ensureGteMin(msg) { if (!this.isGteMin()) throw new Error(msg || "License did not reached the minimum to activate"); }
  _ensureLtMax(msg) { if (!this.isLtMax()) throw new Error(msg || "Maximum payments reached"); }
  
  _next(st) { 
    this._ensureLtMax();
    this._c_cnt += st || 1;
  }

  //
  
  dispatch(cdt, newOwner) {
    expect(this.isParOwn()).toBe(true, "Only creator can dispatch licenses")
    expect(this.isA()).toBe(false, "Can not dispatch activated licenses")
    this.owner = newOwner;
    this._d_at = cdt;
    this._cnc_at = -1;
  }

  //
  
  deposit(cdt, val) {
    expect(this.isParOwn()).toBe(false, "Owners can not deposit")
    this._ensureNotX(cdt);
    this.satoshis += val;
  }
  
  withdraw() {
    if (this.satoshis == 0) throw new Error("Insuficient balance");
    if (this.isParOwn()){
      this.satoshis = 0;
      return;
    } else if (!this.isA()){
      this.satoshis = 0;
      return;
    }
    const dsz = this.reqMinDep();
    if (this.satoshis <= dsz) {
      throw new Error("Balance equal or below minimum");
    }
    this.satoshis = (dsz > 0) ? dsz : 0;
  }

  activate(cdt, pld) {
    expect(this.isParOwn()).toBe(false, "Owner can not activate licenses")
    this._ensureNotX(cdt);
    expect(this.isA()).toBe(false, "License already activated")
    if (this.dbtSz() > 0) throw new Error("Needs the minimum deposit to activate");
    
    this._payExec(cdt, this.reqMinDep(), "Activation payment");
    
    this._a_at = cdt;
    if (this.c_lft > 0){
      this._x_at = cdt + this.lifeTm();
    }
    this._p_c_x_at = cdt + this.minTuSz();
    this.pld = pld || this.pld;
    
    this._next(this.p_c_min);
  }

  pay(cdt) {
    expect(this.isParOwn()).toBe(false, "Owners can not pay licenses")
    expect(this.isA()).toBe(true, "Can not pay non active licenses")
    this._ensureNotX(cdt);
    this._ensureLtMax();
    expect(this.hasLifeTmNext(cdt)).toBe(true, "Contract lifetime next to expire")

    this._payExec(cdt, this.p_c_pr, "Recycle payment");
    
    if (this._p_c_x_at < cdt)
      this._p_c_x_at = cdt + this.p_c_tu;
    else
      this._p_c_x_at += this.p_c_tu;

    this._next(1);
  }

  _payExec(cdt, value, title) {
    if (!this.hasPayBal()) throw new Error("Insuficient balance")
    this._p_h.push([cdt, this.p_c_pr]);
    this._p_l_a = cdt;
    new LIN_Payment(this.parent.owner, value, title, this.title + " - " + this.description)
    this.satoshis -= value;
  }

  send(cdt, addr) {
    expect(this.isParOwn()).toBe(false, "Use dispatch license as an owner")
    this._ensureNotX(cdt);
    this._ensureNotCnc("Can not send cancelled licenses");
    if (!this.trsf) throw new Error("License can not transfer");
    this.owner = addr;
    if (this.verfbl) this._vrf_at = -1;
  }

  cancel(cdt) {
    if (this.isParOwn() && (!this.isD() || (this.isD() && this.isCnc()))) {
      this.destroy(cdt)
      return;
    }
    expect(this.cclb).toBe(true, "Not cancellable license");
    if (!this.isA()){
      this.satoshis = 0;
      this.returnOwner(cdt);
      return;
    }
    this._ensureNotX(cdt);
    this._ensureGteMin("Can not cancel license below minimum");
    let penaltyFee = parseInt((this.satoshis / 2).toString().split(".")[0],10);
    new LIN_Payment(this.parent.owner, penaltyFee, "Cancel penalty")
    this.satoshis = 0;
    this.returnOwner(cdt);
  }

  returnOwner(cdt) {
    expect(this.owner).not.toBe(null, "Already destroyed");
    expect(this.owner).not.toBe(this.parent.owner, "Already owned");
    this.owner = this.parent.owner;
    this._cnc_at = cdt;
  }
  
  destroy(cdt){
    expect(this.isParOwn()).toBe(true, "Only the creator can destroy licenses")
    this._dstr_at = cdt;
    super.destroy(cdt);
  }
  
}
LIN_LicenseContract.title = "LIN_LicenseContract";
LIN_LicenseContract.version = "0.1.0";


LIN_BucketContract.deps = { LIN_LicenseContract, expect: Run.extra.expect } 
LIN_LicenseContract.deps = { LIN_BucketContract, LIN_Payment, expect: Run.extra.expect }
LIN_Payment.deps = { LIN_LicenseContract, expect: Run.extra.expect }