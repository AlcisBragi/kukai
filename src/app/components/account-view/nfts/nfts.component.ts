import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Account, ImplicitAccount, TorusWallet } from '../../../services/wallet/wallet';
import { WalletService } from '../../../services/wallet/wallet.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../../../services/message/message.service';
import { TokenService } from '../../../services/token/token.service';
import { CONSTANTS } from '../../../../environments/environment';
import { ModalComponent } from '../../modal/modal.component';
import { TokenBalancesService } from '../../../services/token-balances/token-balances.service';
import { SubjectService } from '../../../services/subject/subject.service';
import { DisplayLinkOption } from '../../../interfaces';
import Big from 'big.js';

@Component({
  selector: 'app-nfts',
  templateUrl: './nfts.component.html',
  styleUrls: ['../../../../scss/components/account-view/cards/nfts.component.scss'],
})
export class NftsComponent implements OnInit, AfterViewInit {
  DisplayLinkOption = DisplayLinkOption;
  Object = Object;
  Number = Number;
  nfts = undefined;
  isDiscover: boolean = false;
  filter: string = 'APP';
  contractAliases = CONSTANTS.CONTRACT_ALIASES;
  constructor(
    public translate: TranslateService,
    public messageService: MessageService,
    public tokenService: TokenService,
    public tokenBalancesService: TokenBalancesService,
    private subjectService: SubjectService,
    private walletService: WalletService
  ) {
    this.subjectService.logout.subscribe(o => {
      if (o) {
        this.nfts = undefined;
        this.isDiscover = false;
      }
    })
  }
  @Input() activity: any;
  @Input() account;
  ngOnInit(): void {
    this.subjectService.nftsUpdated.subscribe(nfts => {
      this.isDiscover = !(nfts && !!Object.keys(nfts)?.length);
      this.nfts = nfts;
    });
  }
  ngAfterViewInit() {
  }
  displayTokenCard(): boolean {
    return this.nfts !== undefined;
  }
  toggleDropdown(sel) {
    const elem = [].slice.call(document.querySelectorAll(`.nfts .collection`));
    const c = document.querySelector(sel);
    c.classList.toggle('expanded');
    elem.forEach(token => { if (!c.classList.contains('expanded')) { token.querySelector('.body').scrollTop = 0; } else { if(window.innerWidth < 1169) { document.body.scroll(0, document.querySelector(sel).offsetTop - 25); }} });
  }
  viewToken(token) {
    ModalComponent.currentModel.next({ name: 'token-detail', data: token });
  }
  shouldDisplayLink(option: DisplayLinkOption) {
    if (option === 0 || (option === 1 && this.walletService.wallet instanceof TorusWallet)) {
      return true;
    }
    return false;
  }
  // in time break into subcomp with ecmpId = this.constructor['ɵcmp'].id; for id
  sanitizeKey(key: string, i: number) {
    return key.replace(/ /g, '') + i;
  }
  formatBalance(token) {
    return Big(token.balance).div(10 ** parseInt(token.decimals)).toFixed();
  }
  trackToken(index: number, token: any) {
    return token?.id ? token.contractAddress + ':' + token?.id + ':' + token?.balance : null;
  }
}